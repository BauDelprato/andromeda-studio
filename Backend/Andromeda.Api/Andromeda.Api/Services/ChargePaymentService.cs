using Andromeda.Api.Data;
using Andromeda.Api.DTOs.ChargePayment;
using Andromeda.Api.DTOs.Payments;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class ChargePaymentService
    {
        private readonly ApplicationDbContext _context;

        public ChargePaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentResponse> CreateAsync(CreatePaymentRequest request)
        {
            if (request.Amount <= 0)
            {
                throw new InvalidOperationException("El importe del pago debe ser mayor que cero.");
            }

            if (request.Charges == null || request.Charges.Count == 0)
            {
                throw new InvalidOperationException("El pago debe asociarse al menos a un cargo.");
            }

            if (!Enum.IsDefined(request.Method))
            {
                throw new InvalidOperationException("El método de pago no es válido.");
            }

            var studentExists = await _context.Students
                .AnyAsync(student => student.Id == request.StudentId);
            if (!studentExists)
            {
                throw new InvalidOperationException("El estudiante no existe.");
            }

            var assignedAmount = request.Charges.Sum(charge => charge.Amount);
            if (assignedAmount != request.Amount)
            {
                throw new InvalidOperationException("El importe del pago debe coincidir con la suma de los importes asignados a los cargos.");
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();

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

            await CreateAsync(payment, request);
            await transaction.CommitAsync();

            return MapToResponse(payment);
        }

        public async Task CreateAsync(Payment payment, CreatePaymentRequest request)
        {
            var duplicateChargeId = request.Charges
                .GroupBy(item => item.ChargeId)
                .FirstOrDefault(group => group.Count() > 1)?.Key;

            if (duplicateChargeId.HasValue)
            {
                throw new InvalidOperationException($"El cargo {duplicateChargeId.Value} fue enviado más de una vez.");
            }

            foreach (var item in request.Charges)
            {
                if (item.Amount <= 0)
                {
                    throw new InvalidOperationException($"El importe del cargo {item.ChargeId} debe ser mayor que cero.");
                }

                var charge = await _context.Charges
                    .FirstOrDefaultAsync(candidate => candidate.Id == item.ChargeId);

                if (charge == null)
                {
                    throw new InvalidOperationException($"El cargo {item.ChargeId} no existe.");
                }

                if (charge.StudentId != request.StudentId || payment.StudentId != request.StudentId)
                {
                    throw new InvalidOperationException($"El cargo {item.ChargeId} no pertenece al estudiante {request.StudentId}.");
                }

                if (charge.Status is ChargeStatus.Cancelled or ChargeStatus.Expired)
                {
                    throw new InvalidOperationException($"El cargo {item.ChargeId} no admite pagos en su estado actual.");
                }

                var chargeTotal = charge.Amount - charge.DiscountAmount;
                var previouslyPaid = await _context.ChargePayments
                    .Where(link => link.ChargeId == charge.Id)
                    .SumAsync(link => (decimal?)link.Amount) ?? 0m;
                var outstanding = chargeTotal - previouslyPaid;

                if (outstanding <= 0)
                {
                    throw new InvalidOperationException($"El cargo {item.ChargeId} no tiene saldo pendiente.");
                }

                if (item.Amount > outstanding)
                {
                    throw new InvalidOperationException($"El cargo {item.ChargeId} tiene un saldo pendiente de {outstanding}.");
                }

                _context.ChargePayments.Add(new ChargePayment
                {
                    ChargeId = charge.Id,
                    PaymentId = payment.Id,
                    Amount = item.Amount
                });

                var totalPaid = previouslyPaid + item.Amount;
                charge.Status = totalPaid >= chargeTotal
                    ? ChargeStatus.Paid
                    : ChargeStatus.PartiallyPaid;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<ChargePaymentResponse>> GetByPaymentIdAsync(int paymentId)
        {
            return await _context.ChargePayments
                .AsNoTracking()
                .Where(link => link.PaymentId == paymentId)
                .Select(link => new ChargePaymentResponse
                {
                    ChargeId = link.ChargeId,
                    PaymentId = link.PaymentId,
                    Amount = link.Amount,
                    Status = link.Charge.Status,
                    CreatedAt = link.Charge.CreatedAt
                })
                .ToListAsync();
        }

        private static PaymentResponse MapToResponse(Payment payment) => new()
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
