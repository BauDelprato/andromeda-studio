using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Payments;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;


//tiene solo un get y un create

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

        public async Task<PaymentResponse> CreateAsync(
            CreatePaymentRequest request)
        {
            if (request.Amount < 0)
            {
                throw new InvalidOperationException(
                    "El amount no puede ser negativo.");
            }

            var studentExists = await _context.Students
                .AnyAsync(s => s.Id == request.StudentId);

            if (!studentExists)
            {
                throw new InvalidOperationException(
                    "El estudiante no existe.");
            }

            var payment = new Payment
            {
                StudentId = request.StudentId,
                Amount = request.Amount,
                Date = request.Date,
                Method = request.Method,
                Notes = request.Notes,
                TransactionReference = request.TransactionReference,
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            await _context.SaveChangesAsync();

            return MapToResponse(payment);
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
                Date = payment.Date,
                Method = payment.Method,
                Notes = payment.Notes,
                TransactionReference = payment.TransactionReference,
                CreatedAt = payment.CreatedAt
            };
        }

        private PaymentResponse MapToResponse(Payment payment)
        {
            return new PaymentResponse
            {
                Id = payment.Id,
                StudentId = payment.StudentId,
                Amount = payment.Amount,
                Date = payment.Date,
                Method = payment.Method,
                Notes = payment.Notes,
                TransactionReference = payment.TransactionReference,
                CreatedAt = payment.CreatedAt
            };
        }
    }
}
