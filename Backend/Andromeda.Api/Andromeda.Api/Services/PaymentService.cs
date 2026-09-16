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
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            await _context.SaveChangesAsync();

            return MapToResponse(payment);
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
                CreatedAt = payment.CreatedAt
            };
        }
    }
}