using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Prices;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class PriceService
    {
        private readonly ApplicationDbContext _context;

        public PriceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PriceResponse>> GetAllAsync()
        {
            var prices = await _context.Prices
                .AsNoTracking()
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return prices
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<PriceResponse?> GetByIdAsync(int id)
        {
            var price = await _context.Prices
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (price == null)
            {
                return null;
            }

            return MapToResponse(price);
        }

        public async Task<PriceResponse> CreateAsync(
            CreatePriceRequest request)
        {
            ValidatePriceRequest(request);

            var existingPrices = await _context.Prices
                .Where(p =>
                    p.Type == request.Type &&
                    p.CrewLevel == request.CrewLevel)
                .ToListAsync();

            foreach (var price in existingPrices) //verificación de superposición de precios
            {
                bool overlaps =
                    (!price.ValidTo.HasValue ||
                     request.ValidFrom < price.ValidTo.Value) &&
                    (!request.ValidTo.HasValue ||
                     price.ValidFrom < request.ValidTo.Value);

                if (!overlaps)
                {
                    continue;
                }

                if (price.ValidFrom >= request.ValidFrom)
                {
                    throw new InvalidOperationException(
                        "El período de vigencia se superpone con otro precio existente.");
                }

                // Cierra el precio anterior cuando comienza el nuevo
                price.ValidTo = request.ValidFrom;
            }

            var priceToCreate = new Price
            {
                Type = request.Type,
                CrewLevel = request.CrewLevel,
                Amount = request.Amount,
                CreatedAt = DateTime.UtcNow,
                ValidFrom = request.ValidFrom,
                ValidTo = request.ValidTo
            };

            _context.Prices.Add(priceToCreate);

            await _context.SaveChangesAsync();

            return MapToResponse(priceToCreate);
        }

        public async Task<PriceResponse?> UpdateAsync(
            int id,
            UpdatePriceRequest request)
        {
            var price = await _context.Prices.FindAsync(id);

            if (price == null)
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

                price.Amount = request.Amount.Value;
            }

            if (request.ValidFrom.HasValue ||
                request.ValidTo.HasValue)
            {
                var validFrom = request.ValidFrom ?? price.ValidFrom;
                var validTo = request.ValidTo ?? price.ValidTo;

                ValidateValidityPeriod(validFrom, validTo);

                price.ValidFrom = validFrom;
                price.ValidTo = validTo;
            }

            await _context.SaveChangesAsync();

            return MapToResponse(price);
        }

        public async Task<Price> GetActivePriceAsync(
            PriceType type,
            CrewLevel? crewLevel = null)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            return await GetPriceForPeriodAsync(
                type,
                today,
                crewLevel);
        }

        public async Task<Price> GetPriceForPeriodAsync(
            PriceType type,
            DateOnly period,
            CrewLevel? crewLevel = null)
        {
            var prices = await _context.Prices
                .Where(p =>
                    p.Type == type &&
                    p.CrewLevel == crewLevel &&
                    p.ValidFrom <= period &&
                    (!p.ValidTo.HasValue ||
                     period < p.ValidTo.Value))
                .OrderByDescending(p => p.ValidFrom)
                .Take(2)
                .ToListAsync();

            if (prices.Count > 1)
            {
                throw new InvalidOperationException(
                    $"Existe más de un precio vigente para {type}" +
                    (crewLevel.HasValue
                        ? $" y nivel {crewLevel.Value}"
                        : "") +
                    $" en el período {period:yyyy-MM-dd}.");
            }

            if (prices.Count == 0)
            {
                throw new InvalidOperationException(
                    $"No existe un precio vigente para {type}" +
                    (crewLevel.HasValue
                        ? $" y nivel {crewLevel.Value}"
                        : "") +
                    $" en el período {period:yyyy-MM-dd}.");
            }

            return prices[0];
        }

        private void ValidatePriceRequest(CreatePriceRequest request)
        {
            if (request.Amount < 0)
            {
                throw new InvalidOperationException(
                    "El amount no puede ser negativo.");
            }

            ValidateValidityPeriod(
                request.ValidFrom,
                request.ValidTo);

            if (request.Type == PriceType.Crew &&
                !request.CrewLevel.HasValue)
            {
                throw new InvalidOperationException(
                    "Un Price de Crew requiere CrewLevel.");
            }

            if (request.Type != PriceType.Crew &&
                request.CrewLevel.HasValue)
            {
                throw new InvalidOperationException(
                    "CrewLevel solo puede utilizarse en Prices de Crew.");
            }
        }

        private void ValidateValidityPeriod(
            DateOnly validFrom,
            DateOnly? validTo)
        {
            if (validFrom == default)
            {
                throw new InvalidOperationException(
                    "ValidFrom es obligatorio.");
            }

            if (validTo.HasValue && validTo.Value <= validFrom)
            {
                throw new InvalidOperationException(
                    "ValidTo debe ser posterior a ValidFrom.");
            }
        }

        private PriceResponse MapToResponse(Price price)
        {
            return new PriceResponse
            {
                Id = price.Id,
                Type = price.Type,
                CrewLevel = price.CrewLevel,
                Amount = price.Amount,
                CreatedAt = price.CreatedAt,
                ValidFrom = price.ValidFrom,
                ValidTo = price.ValidTo
            };
        }
    }
}