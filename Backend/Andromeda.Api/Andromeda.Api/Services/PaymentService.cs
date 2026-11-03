using Andromeda.Api.Constants;
using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Payments;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class PaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PaymentResponse>> GetAllAsync()
        {
            var payments = await _context.Payments
                .AsNoTracking()
                .ToListAsync();

            return payments
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<Payment> CreateFromChargePaymentAsync( CreatePaymentRequest request)
        {
            var cashRegister = await _context.CashRegisters
                .SingleOrDefaultAsync(cr => cr.ClosedAt == null);

            if (cashRegister == null)
            {
                throw new InvalidOperationException(
                    "No existe una caja abierta para registrar el pago.");
            }

            var category = await _context.Categories
                .FirstOrDefaultAsync(c =>
                    c.SystemCode == CategorySystemCodes.AcademyIncome &&
                    c.IsActive);

            if (category == null)
            {
                throw new InvalidOperationException(
                    "No existe una categoría activa para los ingresos automáticos de la academia.");
            }

            var now = DateTime.UtcNow;

            var payment = new Payment
            {
                StudentId = request.StudentId,
                Amount = request.Amount,
                DiscountAmount = request.DiscountAmount,
                Date = request.Date,
                Method = request.Method,
                Notes = request.Notes,
                TransactionReference = request.TransactionReference,
                CreatedAt = now
            };

            var transaction = new Transaction
            {
                CashRegisterId = cashRegister.Id,
                CategoryId = category.Id,
                Payment = payment,
                Amount = payment.Amount,
                Type = TransactionType.Income,
                Method = payment.Method,
                Notes = payment.Notes,
                CreatedAt = now
            };

            _context.Payments.Add(payment);
            _context.Transactions.Add(transaction);

            await _context.SaveChangesAsync();

            return payment;
        }

        public async Task<UpdatePaymentResponse?> UpdateAsync( int id, UpdatePaymentRequest request)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return null;
            }

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.PaymentId == id);

            if (request.Method.HasValue)
            {
                if (!Enum.IsDefined(request.Method.Value))
                {
                    throw new InvalidOperationException("El método de pago no es válido.");
                }

                payment.Method = request.Method.Value;

                if (transaction != null)
                {
                    transaction.Method = request.Method.Value;
                }
            }

            if (request.Notes != null)
            {
                var notes = string.IsNullOrWhiteSpace(request.Notes)
                    ? null
                    : request.Notes.Trim();

                payment.Notes = notes;

                if (transaction != null)
                {
                    transaction.Notes = notes;
                }
            }

            if (request.TransactionReference != null)
            {
                payment.TransactionReference = request.TransactionReference;
            }

            await _context.SaveChangesAsync();

            return new UpdatePaymentResponse
            {
                Id = payment.Id,
                StudentId = payment.StudentId,
                Amount = payment.Amount,
                DiscountAmount = payment.DiscountAmount,
                Date = payment.Date,
                Method = payment.Method,
                Notes = payment.Notes,
                TransactionReference = payment.TransactionReference,
                CreatedAt = payment.CreatedAt
            };
        }

        private static PaymentResponse MapToResponse(Payment payment) => new()
        {
            Id = payment.Id,
            StudentId = payment.StudentId,
            Amount = payment.Amount,
            DiscountAmount = payment.DiscountAmount,
            Date = payment.Date,
            Method = payment.Method,
            Notes = payment.Notes,
            TransactionReference = payment.TransactionReference,
            CreatedAt = payment.CreatedAt
        };
    }
}