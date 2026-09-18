using Andromeda.Api.Data;
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

        //Solo el create es enorme porque hace una banda de verificaciones.

        public async Task CreateAsync(
            Payment payment,
            CreatePaymentRequest request)
        {
            var duplicateChargeIds = request.Charges
                .GroupBy(c => c.ChargeId)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToList();

            if (duplicateChargeIds.Count > 0)
            {
                throw new InvalidOperationException(
                    $"El cargo {duplicateChargeIds[0]} fue enviado más de una vez.");
            }

            foreach (var item in request.Charges)
            {
                await CreateChargePaymentAsync(
                    payment,
                    request.StudentId,
                    item);
            }
        }

        private async Task CreateChargePaymentAsync(
            Payment payment,
            int studentId,
            CreatePaymentChargeRequest request)
        {
            if (request.Amount <= 0)
            {
                throw new InvalidOperationException(
                    $"El importe del cargo {request.ChargeId} debe ser mayor que cero.");
            }

            var charge = await _context.Charges
                .FirstOrDefaultAsync(c =>
                    c.Id == request.ChargeId);

            if (charge == null)
            {
                throw new InvalidOperationException(
                    $"El cargo {request.ChargeId} no existe.");
            }

            if (charge.StudentId != studentId)
            {
                throw new InvalidOperationException(
                    $"El cargo {request.ChargeId} no pertenece al estudiante {studentId}.");
            }

            if (charge.Status == ChargeStatus.Cancelled)
            {
                throw new InvalidOperationException(
                    $"El cargo {request.ChargeId} está cancelado.");
            }

            if (charge.Status == ChargeStatus.Paid)
            {
                throw new InvalidOperationException(
                    $"El cargo {request.ChargeId} ya está pagado.");
            }

            var chargeAmount =
                charge.Amount - charge.DiscountAmount;

            var paidAmount = await _context.ChargePayments
                .Where(cp => cp.ChargeId == charge.Id)
                .SumAsync(cp => (decimal?)cp.Amount) ?? 0;

            var pendingAmount = chargeAmount - paidAmount;

            if (pendingAmount <= 0)
            {
                charge.Status = ChargeStatus.Paid;

                throw new InvalidOperationException(
                    $"El cargo {request.ChargeId} no tiene saldo pendiente.");
            }

            if (request.Amount > pendingAmount)
            {
                throw new InvalidOperationException(
                    $"El cargo {request.ChargeId} tiene un saldo pendiente de {pendingAmount}.");
            }

            var chargePayment = new ChargePayment
            {
                ChargeId = charge.Id,
                PaymentId = payment.Id,
                Amount = request.Amount
            };

            _context.ChargePayments.Add(chargePayment);

            var totalPaid = paidAmount + request.Amount;

            charge.Status = totalPaid >= chargeAmount
                ? ChargeStatus.Paid
                : ChargeStatus.PartiallyPaid;

            await _context.SaveChangesAsync();
        }
    }
}