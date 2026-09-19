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

            var existingActivePrice = await _context.Prices
                .Where(p =>
                    p.Type == request.Type &&
                    p.CrewLevel == request.CrewLevel &&
                    p.IsActive)
                .ToListAsync();

            foreach (var price in existingActivePrice)
            {
                price.IsActive = false;
            }

            var priceToCreate = new Price
            {
                Type = request.Type,
                CrewLevel = request.CrewLevel,
                Amount = request.Amount,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
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

            if (request.IsActive.HasValue)
            {
                if (request.IsActive.Value)
                {
                    var existingActivePrice = await _context.Prices
                        .Where(p =>
                            p.Id != price.Id &&
                            p.Type == price.Type &&
                            p.CrewLevel == price.CrewLevel &&
                            p.IsActive)
                        .ToListAsync();

                    foreach (var activePrice in existingActivePrice)
                    {
                        activePrice.IsActive = false;
                    }
                }

                price.IsActive = request.IsActive.Value;
            }

            await _context.SaveChangesAsync();

            return MapToResponse(price);
        }

        public async Task<Price?> GetActivePriceAsync(
            PriceType type,
            CrewLevel? crewLevel = null)
        {
            var price = await _context.Prices
                .Where(p =>
                    p.Type == type &&
                    p.CrewLevel == crewLevel &&
                    p.IsActive)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (price == null)
            {
                throw new InvalidOperationException(
                    $"No existe un precio activo para {type}" +
                    (crewLevel.HasValue
                        ? $" y nivel {crewLevel.Value}."
                        : "."));
            }

            return price;
        }

        private void ValidatePriceRequest(CreatePriceRequest request)
        {
            if (request.Amount < 0)
            {
                throw new InvalidOperationException(
                    "El amount no puede ser negativo.");
            }

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

        private PriceResponse MapToResponse(Price price)
        {
            return new PriceResponse
            {
                Id = price.Id,
                Type = price.Type,
                CrewLevel = price.CrewLevel,
                Amount = price.Amount,
                IsActive = price.IsActive,
                CreatedAt = price.CreatedAt
            };
        }
    }
}