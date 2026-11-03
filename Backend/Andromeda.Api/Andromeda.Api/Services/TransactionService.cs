using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Transactions;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class TransactionService
    {
        private readonly ApplicationDbContext _context;

        public TransactionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TransactionResponse>> GetAllAsync(TransactionFilter filter)
        {
            ValidateFilter(filter);

            IQueryable<Transaction> query = _context.Transactions
                .AsNoTracking()
                .Include(t => t.Category);

            if (filter.CashRegisterId.HasValue)
            {
                query = query.Where(t =>
                    t.CashRegisterId == filter.CashRegisterId.Value);
            }

            if (filter.CategoryId.HasValue)
            {
                query = query.Where(t =>
                    t.CategoryId == filter.CategoryId.Value);
            }

            if (filter.Type.HasValue)
            {
                query = query.Where(t =>
                    t.Type == filter.Type.Value);
            }

            if (filter.Method.HasValue)
            {
                query = query.Where(t =>
                    t.Method == filter.Method.Value);
            }

            if (filter.CreatedFromUtc.HasValue)
            {
                query = query.Where(t =>
                    t.CreatedAt >= filter.CreatedFromUtc.Value);
            }

            if (filter.CreatedToUtc.HasValue)
            {
                query = query.Where(t =>
                    t.CreatedAt <= filter.CreatedToUtc.Value);
            }

            var transactions = await query
                .OrderByDescending(t => t.CreatedAt)
                .ThenByDescending(t => t.Id)
                .ToListAsync();

            return transactions
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<TransactionResponse?> GetByIdAsync(int id)
        {
            var transaction = await _context.Transactions
                .AsNoTracking()
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == id);

            return transaction == null
                ? null
                : MapToResponse(transaction);
        }

        public async Task<TransactionResponse> CreateAsync(CreateTransactionRequest request)
        {
            ValidateAmount(request.Amount);
            ValidateTransactionType(request.Type);
            ValidatePaymentMethod(request.Method);

            var category = await _context.Categories
                .FirstOrDefaultAsync(c =>
                    c.Id == request.CategoryId &&
                    c.IsActive);

            if (category == null)
            {
                throw new InvalidOperationException(
                    "La categoría no existe o está inactiva.");
            }

            var cashRegister = await GetOpenCashRegisterAsync();

            var transaction = new Transaction
            {
                CashRegisterId = cashRegister.Id,
                CategoryId = category.Id,
                Amount = request.Amount,
                Type = request.Type,
                Method = request.Method,
                Notes = NormalizeNotes(request.Notes),
                CreatedAt = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);

            await _context.SaveChangesAsync();

            transaction.Category = category;

            return MapToResponse(transaction);
        }

        public async Task<TransactionResponse?> UpdateAsync( int id, UpdateTransactionRequest request)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.CashRegister)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null)
            {
                return null;
            }

            if (transaction.PaymentId.HasValue)
            {
                throw new InvalidOperationException(
                    "No se pueden modificar manualmente transacciones vinculadas a Payments.");
            }

            if (request.CategoryId == null &&
                request.Amount == null &&
                request.Type == null &&
                request.Method == null &&
                request.Notes == null)
            {
                throw new InvalidOperationException(
                    "Debe proporcionar al menos un campo para actualizar.");
            }

            var previousContribution = GetBalanceContribution(transaction);

            if (request.CategoryId.HasValue)
            {
                var category = await _context.Categories
                    .FirstOrDefaultAsync(c =>
                        c.Id == request.CategoryId.Value &&
                        c.IsActive);

                if (category == null)
                {
                    throw new InvalidOperationException(
                        "La categoría no existe o está inactiva.");
                }

                transaction.CategoryId = category.Id;
                transaction.Category = category;
            }

            if (request.Amount.HasValue)
            {
                ValidateAmount(request.Amount.Value);
                transaction.Amount = request.Amount.Value;
            }

            if (request.Type.HasValue)
            {
                ValidateTransactionType(request.Type.Value);
                transaction.Type = request.Type.Value;
            }

            if (request.Method.HasValue)
            {
                ValidatePaymentMethod(request.Method.Value);
                transaction.Method = request.Method.Value;
            }

            if (request.Notes != null)
            {
                transaction.Notes = NormalizeNotes(request.Notes);
            }

            var currentContribution = GetBalanceContribution(transaction);

            AdjustClosedCashRegisterBalance(
                transaction.CashRegister,
                currentContribution - previousContribution);

            await _context.SaveChangesAsync();

            return MapToResponse(transaction);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var transaction = await _context.Transactions
                .Include(t => t.CashRegister)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null)
            {
                return false;
            }

            if (transaction.PaymentId.HasValue)
            {
                throw new InvalidOperationException(
                    "No se pueden eliminar manualmente transacciones vinculadas a Payments.");
            }

            var contribution = GetBalanceContribution(transaction);

            AdjustClosedCashRegisterBalance(
                transaction.CashRegister,
                -contribution);

            _context.Transactions.Remove(transaction);

            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<CashRegister> GetOpenCashRegisterAsync()
        {
            var openRegisters = await _context.CashRegisters
                .Where(cr => cr.ClosedAt == null)
                .OrderByDescending(cr => cr.OpenedAt)
                .Take(2)
                .ToListAsync();

            if (openRegisters.Count == 0)
            {
                throw new InvalidOperationException(
                    "No existe una caja abierta para registrar la transacción.");
            }

            if (openRegisters.Count > 1)
            {
                throw new InvalidOperationException(
                    "Existe más de una caja abierta. No se puede determinar dónde registrar la transacción.");
            }

            return openRegisters[0];
        }

        private static void ValidateFilter(TransactionFilter filter)
        {
            if (filter.CreatedFromUtc.HasValue &&
                filter.CreatedToUtc.HasValue &&
                filter.CreatedFromUtc.Value > filter.CreatedToUtc.Value)
            {
                throw new InvalidOperationException(
                    "CreatedFromUtc no puede ser posterior a CreatedToUtc.");
            }

            if (filter.Type.HasValue)
            {
                ValidateTransactionType(filter.Type.Value);
            }

            if (filter.Method.HasValue)
            {
                ValidatePaymentMethod(filter.Method.Value);
            }
        }

        private static void ValidateAmount(decimal amount)
        {
            if (amount <= 0)
            {
                throw new InvalidOperationException(
                    "El importe de la transacción debe ser mayor a cero.");
            }
        }

        private static void ValidateTransactionType(TransactionType type)
        {
            if (!Enum.IsDefined(type))
            {
                throw new InvalidOperationException(
                    "El tipo de transacción no es válido.");
            }
        }

        private static void ValidatePaymentMethod(PaymentMethod method)
        {
            if (!Enum.IsDefined(method))
            {
                throw new InvalidOperationException(
                    "El método de pago no es válido.");
            }
        }

        private static string? NormalizeNotes(string? notes)
        {
            return string.IsNullOrWhiteSpace(notes)
                ? null
                : notes.Trim();
        }

        // Ingresos suman egresos restan.
        private static decimal GetBalanceContribution(
            Transaction transaction)
        {
            return transaction.Type == TransactionType.Income
                ? transaction.Amount
                : -transaction.Amount;
        }

        // Si la caja está cerrada, mantiene actualizado su saldo final.
        private static void AdjustClosedCashRegisterBalance(
            CashRegister cashRegister,
            decimal difference)
        {
            if (!cashRegister.ClosedAt.HasValue)
            {
                return;
            }

            if (!cashRegister.ClosingBalance.HasValue)
            {
                throw new InvalidOperationException(
                    "La caja está cerrada pero no tiene ClosingBalance registrado.");
            }

            cashRegister.ClosingBalance += difference;
        }

        private static TransactionResponse MapToResponse(
            Transaction transaction)
        {
            return new TransactionResponse
            {
                Id = transaction.Id,
                CashRegisterId = transaction.CashRegisterId,
                CategoryId = transaction.CategoryId,
                CategoryName = transaction.Category.Name,
                PaymentId = transaction.PaymentId,
                Amount = transaction.Amount,
                Type = transaction.Type,
                Method = transaction.Method,
                CreatedAt = transaction.CreatedAt,
                Notes = transaction.Notes
            };
        }
    }
}