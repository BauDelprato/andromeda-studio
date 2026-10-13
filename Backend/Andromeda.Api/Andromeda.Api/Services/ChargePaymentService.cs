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

            if (request.DiscountAmount < 0)
            {
                throw new InvalidOperationException("El descuento no puede ser negativo.");
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

            if (decimal.Round(request.Amount, 2) != request.Amount || decimal.Round(request.DiscountAmount, 2) != request.DiscountAmount)
            {
                throw new InvalidOperationException(
                    "Los importes deben tener como máximo dos decimales.");
            }

            foreach (var item in request.Charges)
            {
                if (item.Amount < 0 || decimal.Round(item.Amount, 2) != item.Amount)
                {
                    throw new InvalidOperationException("Los importes asignados deben ser positivos o cero, con un máximo de dos decimales.");
                }
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
                DiscountAmount = request.DiscountAmount,
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

            var entries = new List<(
                Charge Charge,
                decimal Amount,
                decimal PreviouslyPaid,
                decimal PreviouslyDiscounted,
                decimal Outstanding)>();

            foreach (var item in request.Charges) //se recorre cada charge(item) asociado a un mismo payment
            {
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

                var previouslyPaid = await _context.ChargePayments //comprueba pagos anteriores asociados al mismo charge que se intenta pagar, junta lo anteriormente pagado en perviouslyPaid
                    .Where(link => link.ChargeId == charge.Id)
                    .SumAsync(link => (decimal?)link.Amount) ?? 0m;

                var previouslyDiscounted = await _context.ChargePayments //lo mismo con el descuento (sirve más para dejar registro del total descontado que para hacer cuentas)
                    .Where(link => link.ChargeId == charge.Id)
                    .SumAsync(link => (decimal?)link.DiscountAmount) ?? 0m;

                var outstanding = charge.Amount - previouslyPaid - previouslyDiscounted; //outstanding es la cantidad que queda pendiente por pagar de un charge

                if (outstanding <= 0)
                {
                    throw new InvalidOperationException($"El cargo {item.ChargeId} no tiene saldo pendiente.");
                }

                if (item.Amount > outstanding)
                {
                    throw new InvalidOperationException($"El cargo {item.ChargeId} tiene un saldo pendiente de {outstanding}. Supera el importe de {item.Amount}");
                }

                entries.Add(( charge , item.Amount , previouslyPaid , previouslyDiscounted , outstanding ));
            }

            if (payment.DiscountAmount < 0)
            {
                throw new InvalidOperationException(
                    "El descuento no puede ser negativo.");
            }

            // El descuento se distribuye sobre lo que queda pendiente
            // después de asignar el dinero real de este pago.
            var discountCapacities = entries
                .Select(entry => entry.Outstanding - entry.Amount)
                .ToArray();

            var totalDiscountCapacity = discountCapacities.Sum();

            if (payment.DiscountAmount > totalDiscountCapacity)
            {
                throw new InvalidOperationException("El descuento supera el saldo pendiente de los cargos seleccionados después del pago.");
            }

            var discounts = DistributeDiscountProportionally(payment.DiscountAmount, discountCapacities);

            for (int i = 0; i < entries.Count; i++)
            {
                var entry = entries[i];
                var discount = discounts[i];

                _context.ChargePayments.Add(new ChargePayment
                {
                    ChargeId = entry.Charge.Id,
                    PaymentId = payment.Id,
                    Amount = entry.Amount,
                    DiscountAmount = discount
                });

                var totalCovered = entry.PreviouslyPaid
                    + entry.PreviouslyDiscounted
                    + entry.Amount
                    + discount;

                entry.Charge.Status =
                    totalCovered >= entry.Charge.Amount
                        ? ChargeStatus.Paid
                        : ChargeStatus.PartiallyPaid;
            }

            await _context.SaveChangesAsync();
        }

        private static decimal[] DistributeDiscountProportionally(
            decimal discountAmount,
            IReadOnlyList<decimal> capacities)
        {
            var allocations = new decimal[capacities.Count];

            if (discountAmount == 0)
            {
                return allocations;
            }

            var totalCapacity = capacities.Sum();

            if (totalCapacity <= 0)
            {
                throw new InvalidOperationException(
                    "No hay saldo disponible para distribuir el descuento.");
            }

            // Se trabaja en centavos para que la suma de las partes
            // sea exactamente igual al descuento original.
            var totalCents = decimal.ToInt64(discountAmount * 100m);
            var allocatedCents = new long[capacities.Count];
            var remainders = new decimal[capacities.Count];

            for (int i = 0; i < capacities.Count; i++)
            {
                var exactCents =
                    discountAmount * 100m * capacities[i] / totalCapacity;

                var wholeCents = decimal.Floor(exactCents);

                allocatedCents[i] = decimal.ToInt64(wholeCents);
                remainders[i] = exactCents - wholeCents;
            }

            var remainingCents = totalCents - allocatedCents.Sum();

            // Los centavos sobrantes van a las partes con mayor
            // resto decimal, sin superar el saldo de ningún cargo.
            while (remainingCents > 0)
            {
                var selectedIndex = -1;
                var largestRemainder = -1m;

                for (int i = 0; i < capacities.Count; i++)
                {
                    var capacityCents =
                        decimal.ToInt64(capacities[i] * 100m);

                    if (allocatedCents[i] < capacityCents &&
                        remainders[i] > largestRemainder)
                    {
                        selectedIndex = i;
                        largestRemainder = remainders[i];
                    }
                }

                if (selectedIndex == -1)
                {
                    throw new InvalidOperationException(
                        "No se pudo distribuir el descuento sin superar los saldos.");
                }

                allocatedCents[selectedIndex]++;
                remainders[selectedIndex] = -1m;
                remainingCents--;
            }

            for (int i = 0; i < allocations.Length; i++)
            {
                allocations[i] = allocatedCents[i] / 100m;
            }

            return allocations;
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
                    DiscountAmount = link.DiscountAmount,
                    Status = link.Charge.Status,
                    CreatedAt = link.Payment.CreatedAt
                })
                .ToListAsync();
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

