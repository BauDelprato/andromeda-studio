using Andromeda.Api.Data;
using Andromeda.Api.DTOs.CashRegisters;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class CashRegisterService
    {
        private readonly ApplicationDbContext _context;

        public CashRegisterService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CashRegisterResponse>> GetAllAsync()
        {
            var cashRegisters = await _context.CashRegisters
                .AsNoTracking()
                .OrderByDescending(cr => cr.Date)
                .ThenByDescending(cr => cr.OpenedAt)
                .ThenByDescending(cr => cr.Id)
                .ToListAsync();

            return cashRegisters
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<CashRegisterResponse?> GetByIdAsync(int id)
        {
            var cashRegister = await _context.CashRegisters
                .AsNoTracking()
                .FirstOrDefaultAsync(cr => cr.Id == id);

            return cashRegister == null
                ? null
                : MapToResponse(cashRegister);
        }

        public async Task<CashRegisterResponse> CreateAsync()
        {
            var hasOpenRegister = await _context.CashRegisters
                .AnyAsync(cr => cr.ClosedAt == null);

            if (hasOpenRegister)
            {
                throw new InvalidOperationException(
                    "Ya existe una caja abierta. Debe cerrarla antes de crear otra.");
            }

            var previousCashRegister = await _context.CashRegisters
                .Where(cr => cr.ClosedAt != null)
                .OrderByDescending(cr => cr.ClosedAt)
                .ThenByDescending(cr => cr.Id)
                .FirstOrDefaultAsync();

            decimal openingBalance = 0;

            if (previousCashRegister != null)
            {
                if (!previousCashRegister.ClosingBalance.HasValue)
                {
                    throw new InvalidOperationException(
                        "La caja anterior está cerrada pero no tiene ClosingBalance registrado.");
                }

                openingBalance = previousCashRegister.ClosingBalance.Value;
            }

            var now = DateTime.UtcNow;

            var cashRegister = new CashRegister
            {
                Date = DateOnly.FromDateTime(now),
                OpenedAt = now,
                ClosedAt = null,
                OpeningBalance = openingBalance,
                ClosingBalance = null
            };

            _context.CashRegisters.Add(cashRegister);

            await _context.SaveChangesAsync();

            return MapToResponse(cashRegister);
        }

        public async Task<CashRegisterResponse?> CloseAsync(int id)
        {
            var cashRegister = await _context.CashRegisters
                .FirstOrDefaultAsync(cr => cr.Id == id);

            if (cashRegister == null)
            {
                return null;
            }

            if (cashRegister.ClosedAt.HasValue)
            {
                throw new InvalidOperationException(
                    "La caja ya se encuentra cerrada.");
            }

            var now = DateTime.UtcNow;

            cashRegister.ClosingBalance =
                await CalculateClosingBalanceAsync(cashRegister);

            cashRegister.ClosedAt = now;

            await _context.SaveChangesAsync();

            return MapToResponse(cashRegister);
        }

        public async Task<CashRegisterResponse?> UpdateAsync(int id, UpdateCashRegisterRequest request)
        {
            var cashRegister = await _context.CashRegisters
                .FirstOrDefaultAsync(cr => cr.Id == id);

            if (cashRegister == null)
            {
                return null;
            }

            if (request.Date == null &&
                request.OpenedAt == null &&
                request.ClosedAt == null &&
                request.OpeningBalance == null)
            {
                throw new InvalidOperationException(
                    "Debe proporcionar al menos un campo para actualizar.");
            }

            var wasClosed = cashRegister.ClosedAt.HasValue;
            var previousOpeningBalance = cashRegister.OpeningBalance;

            if (request.Date.HasValue)
            {
                if (request.Date.Value == default)
                {
                    throw new InvalidOperationException(
                        "La fecha de la caja no es válida.");
                }

                cashRegister.Date = request.Date.Value;
            }

            if (request.OpenedAt.HasValue)
            {
                cashRegister.OpenedAt = request.OpenedAt.Value;
            }

            if (request.OpeningBalance.HasValue)
            {
                cashRegister.OpeningBalance = request.OpeningBalance.Value;
            }

            if (request.ClosedAt.HasValue)
            {
                cashRegister.ClosedAt = request.ClosedAt.Value;
            }

            if (cashRegister.ClosedAt.HasValue &&
                cashRegister.ClosedAt.Value <= cashRegister.OpenedAt)
            {
                throw new InvalidOperationException(
                    "ClosedAt debe ser posterior a OpenedAt.");
            }

            // Si se cerró mediante PATCH o cambió el saldo inicial
            // de una caja cerrada, se recalcula el saldo final.
            if (cashRegister.ClosedAt.HasValue &&
                (!wasClosed ||
                 cashRegister.OpeningBalance != previousOpeningBalance))
            {
                cashRegister.ClosingBalance =
                    await CalculateClosingBalanceAsync(cashRegister);
            }

            await _context.SaveChangesAsync();

            return MapToResponse(cashRegister);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var cashRegister = await _context.CashRegisters
                .FirstOrDefaultAsync(cr => cr.Id == id);

            if (cashRegister == null)
            {
                return false;
            }

            var hasTransactions = await _context.Transactions
                .AnyAsync(t => t.CashRegisterId == id);

            if (hasTransactions)
            {
                throw new InvalidOperationException(
                    "No se puede eliminar una caja que tiene transacciones asociadas.");
            }

            var hasNewerRegisters = await _context.CashRegisters
                .AnyAsync(cr =>
                    cr.Id != id &&
                    (cr.OpenedAt > cashRegister.OpenedAt ||
                     (cr.OpenedAt == cashRegister.OpenedAt &&
                      cr.Id > cashRegister.Id)));

            if (hasNewerRegisters)
            {
                throw new InvalidOperationException(
                    "No se puede eliminar una caja si existen cajas posteriores.");
            }

            _context.CashRegisters.Remove(cashRegister);

            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<decimal> CalculateClosingBalanceAsync(CashRegister cashRegister)
        {
            var income = await _context.Transactions
                .Where(t =>
                    t.CashRegisterId == cashRegister.Id &&
                    t.Type == TransactionType.Income)
                .SumAsync(t => (decimal?)t.Amount) ?? 0m;

            var expense = await _context.Transactions
                .Where(t =>
                    t.CashRegisterId == cashRegister.Id &&
                    t.Type == TransactionType.Expense)
                .SumAsync(t => (decimal?)t.Amount) ?? 0m;

            return cashRegister.OpeningBalance + income - expense;
        }

        private static CashRegisterResponse MapToResponse(CashRegister cashRegister)
        {
            return new CashRegisterResponse
            {
                Id = cashRegister.Id,
                Date = cashRegister.Date,
                OpenedAt = cashRegister.OpenedAt,
                ClosedAt = cashRegister.ClosedAt,
                OpeningBalance = cashRegister.OpeningBalance,
                ClosingBalance = cashRegister.ClosingBalance
            };
        }
    }
}