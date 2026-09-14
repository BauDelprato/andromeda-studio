using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Charges;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class ChargeService
    {
        private readonly ApplicationDbContext _context;

        public ChargeService(ApplicationDbContext context)
        {
            _context = context;
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

            if (request.StudentCrewId.HasValue)
            {
                var studentCrew = await _context.StudentCrew
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

            var charge = new Charge
            {
                StudentId = request.StudentId,
                Type = request.Type,
                Amount = request.Amount,
                DiscountAmount = request.DiscountAmount,
                BillingPeriod = request.BillingPeriod,
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
                charge.Amount = request.Amount.Value;
            }

            if (request.DiscountAmount.HasValue)
            {
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

        private void ValidateChargeRequest(
            CreateChargeRequest request)
        {
            if (request.Amount < 0)
            {
                throw new InvalidOperationException(
                    "El amount no puede ser negativo.");
            }

            if (request.DiscountAmount < 0)
            {
                throw new InvalidOperationException(
                    "El discount amount no puede ser negativo.");
            }

            ValidateAmounts(
                request.Amount,
                request.DiscountAmount);

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
                StudentCrewId = charge.StudentCrewId
            };
        }
    }
}