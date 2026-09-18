using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Payments;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

//Hice grandes cambios para createpayment 

namespace Andromeda.Api.Services
{
    public class PaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly ChargePaymentService _chargePaymentService;

        public PaymentService(
            ApplicationDbContext context,
            ChargePaymentService chargePaymentService)
        {
            _context = context;
            _chargePaymentService = chargePaymentService;
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
            if (request.Charges.Count == 0)
            {
                throw new InvalidOperationException(
                    "El pago debe incluir al menos un cargo.");
            }

            var studentExists = await _context.Students
                .AnyAsync(s => s.Id == request.StudentId);

            if (!studentExists)
            {
                throw new InvalidOperationException(
                    "El estudiante no existe.");
            }

            var amount = request.Charges.Sum(c => c.Amount);

            if (amount <= 0)
            {
                throw new InvalidOperationException(
                    "El importe del pago debe ser mayor que cero.");
            }

            await using var transaction =
                await _context.Database.BeginTransactionAsync();

            var payment = new Payment
            {
                StudentId = request.StudentId,
                Amount = amount,
                Date = request.Date,
                Method = request.Method,
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            await _context.SaveChangesAsync();

            await _chargePaymentService.CreateAsync(
                payment,
                request);

            await transaction.CommitAsync();

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