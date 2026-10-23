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

        public async Task<UpdatePaymentResponse?> UpdateAsync(
            int id,
            UpdatePaymentRequest request)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return null;
            }

            if (request.Method.HasValue)
            {
                if (!Enum.IsDefined(request.Method.Value))
                {
                    throw new InvalidOperationException("El método de pago no es válido.");
                }

                payment.Method = request.Method.Value;
            }

            if (request.Notes != null)
            {
                payment.Notes = request.Notes;
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