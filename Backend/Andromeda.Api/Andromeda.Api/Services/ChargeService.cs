using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Charges;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class ChargeService
    {
        private readonly ApplicationDbContext _context;
        private readonly PriceService _priceService;

        public ChargeService(
            ApplicationDbContext context,
            PriceService priceService)
        {
            _context = context;
            _priceService = priceService;
        }

        public async Task<List<ChargeResponse>> GetAllAsync()
        {
            var charges = await _context.Charges
                .AsNoTracking()
                .ToListAsync();

            return charges
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<ChargeResponse?> GetByIdAsync(int id)
        {
            var charge = await _context.Charges
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (charge == null)
            {
                return null;
            }

            return MapToResponse(charge);
        }

        public async Task<List<ChargeResponse>> GetByStudentIdAsync(
            int studentId)
        {
            var charges = await _context.Charges
                .AsNoTracking()
                .Where(c => c.StudentId == studentId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return charges
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<ChargeResponse> CreateAsync(
            CreateChargeRequest request)
        {
            ValidateChargeRequest(request);

            var studentExists = await _context.Students
                .AnyAsync(s => s.Id == request.StudentId);

            if (!studentExists)
            {
                throw new InvalidOperationException(
                    "El estudiante no existe.");
            }

            StudentCrew? studentCrew = null;

            if (request.StudentCrewId.HasValue)
            {
                studentCrew = await _context.StudentCrew
                    .Include(sc => sc.Crew)
                    .FirstOrDefaultAsync(sc =>
                        sc.Id == request.StudentCrewId.Value);

                if (studentCrew == null)
                {
                    throw new InvalidOperationException(
                        "La relación StudentCrew no existe.");
                }

                if (studentCrew.StudentId != request.StudentId)
                {
                    throw new InvalidOperationException(
                        "El StudentCrew no pertenece al estudiante indicado.");
                }
            }

            var price = await ResolvePriceAsync(
                request.Type,
                studentCrew);

            var billingPeriod = request.BillingPeriod;

            if (!billingPeriod.HasValue)
            {
                billingPeriod = GetDefaultBillingPeriod(request.Type);
            }

            ValidateAmounts(
                price.Amount,
                request.DiscountAmount);

            var charge = new Charge
            {
                StudentId = request.StudentId,
                Type = request.Type,
                Amount = price.Amount,
                DiscountAmount = request.DiscountAmount,
                PriceId = price.Id,
                BillingPeriod = billingPeriod,
                Status = ChargeStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                StudentCrewId = request.StudentCrewId
            };

            _context.Charges.Add(charge);

            await _context.SaveChangesAsync();

            return MapToResponse(charge);
        }

        public async Task<ChargeResponse?> UpdateAsync(
            int id,
            UpdateChargeRequest request)
        {
            var charge = await _context.Charges.FindAsync(id);

            if (charge == null)
            {
                return null;
            }

            if (request.Amount.HasValue)
            {
                if (request.Amount.Value < 0)
                {
                    throw new InvalidOperationException(
                        "El amount no puede ser negativo.");
                }

                charge.Amount = request.Amount.Value;
            }

            if (request.DiscountAmount.HasValue)
            {
                if (request.DiscountAmount.Value < 0)
                {
                    throw new InvalidOperationException(
                        "El discount amount no puede ser negativo.");
                }

                charge.DiscountAmount = request.DiscountAmount.Value;
            }

            if (request.BillingPeriod.HasValue)
            {
                charge.BillingPeriod = request.BillingPeriod.Value;
            }

            if (request.Status.HasValue)
            {
                charge.Status = request.Status.Value;
            }

            ValidateAmounts(
                charge.Amount,
                charge.DiscountAmount);

            await _context.SaveChangesAsync();

            return MapToResponse(charge);
        }

        private async Task<Price> ResolvePriceAsync(
            ChargeType chargeType,
            StudentCrew? studentCrew)
        {
            switch (chargeType)
            {
                case ChargeType.Registration:
                    return await _priceService.GetActivePriceAsync(
                        PriceType.Registration);

                case ChargeType.Crew:
                    if (studentCrew == null)
                    {
                        throw new InvalidOperationException(
                            "Un cargo de Crew requiere StudentCrewId.");
                    }

                    return await _priceService.GetActivePriceAsync(
                        PriceType.Crew,
                        studentCrew.Crew.Level);

                case ChargeType.ClassSession:
                    throw new InvalidOperationException(
                        "ClassSession todavía no está implementado.");

                case ChargeType.ClassPackage:
                    throw new InvalidOperationException(
                        "ClassPackage todavía no está implementado.");

                case ChargeType.BoxSession:
                    throw new InvalidOperationException(
                        "BoxSession todavía no está implementado.");

                case ChargeType.BoxPackage:
                    throw new InvalidOperationException(
                        "BoxPackage todavía no está implementado.");

                default:
                    throw new InvalidOperationException(
                        "Tipo de Charge no válido.");
            }
        }

        private DateOnly GetDefaultBillingPeriod(
            ChargeType chargeType)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            return chargeType switch
            {
                ChargeType.Registration =>
                    new DateOnly(today.Year, 1, 1),

                ChargeType.Crew =>
                    new DateOnly(today.Year, today.Month, 1),

                _ => today
            };
        }

        private void ValidateChargeRequest(
            CreateChargeRequest request)
        {
            if (request.DiscountAmount < 0)
            {
                throw new InvalidOperationException(
                    "El discount amount no puede ser negativo.");
            }

            if (request.Type == ChargeType.Crew &&
                !request.StudentCrewId.HasValue)
            {
                throw new InvalidOperationException(
                    "Un cargo de Crew requiere StudentCrewId.");
            }

            if (request.Type != ChargeType.Crew &&
                request.StudentCrewId.HasValue)
            {
                throw new InvalidOperationException(
                    "StudentCrewId solo puede utilizarse en cargos de Crew.");
            }
        }

        private void ValidateAmounts(
            decimal amount,
            decimal discountAmount)
        {
            if (discountAmount > amount)
            {
                throw new InvalidOperationException(
                    "El descuento no puede ser mayor que el amount.");
            }
        }

        private ChargeResponse MapToResponse(Charge charge)
        {
            return new ChargeResponse
            {
                Id = charge.Id,
                StudentId = charge.StudentId,
                Type = charge.Type,
                Amount = charge.Amount,
                DiscountAmount = charge.DiscountAmount,
                TotalAmount = charge.Amount - charge.DiscountAmount,
                BillingPeriod = charge.BillingPeriod,
                Status = charge.Status,
                CreatedAt = charge.CreatedAt,
                StudentCrewId = charge.StudentCrewId,
                PriceId = charge.PriceId
            };
        }
    }
}