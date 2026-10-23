using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Discounts;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class DiscountService
    {
        private readonly ApplicationDbContext _context;

        public DiscountService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DiscountResponse>> GetAllAsync()
        {
            var discounts = await _context.Discounts
                .AsNoTracking()
                .OrderBy(d => d.Id)
                .ToListAsync();

            return discounts.Select(MapToResponse).ToList();
        }

        public async Task<DiscountResponse> CreateAsync(CreateDiscountRequest request)
        {
            if (!Enum.IsDefined(typeof(DiscountType), request.Type))
            {
                throw new InvalidOperationException("El tipo de descuento no es válido.");
            }

            if (request.Type == DiscountType.Percentage && request.DiscountAmount > 100)
            {
                throw new InvalidOperationException("El porcentaje de descuento no puede superar el 100 %.");
            }

            if (string.IsNullOrWhiteSpace(request.Name))
                throw new InvalidOperationException("El nombre del descuento es obligatorio.");

            if (request.DiscountAmount <= 0)
                throw new InvalidOperationException("El valor del descuento debe ser mayor a 0.");

            var discount = new Discount
            {
                Name = request.Name,
                Type = request.Type,
                DiscountAmount = request.DiscountAmount,
                IsActive = true
            };

            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync();

            return MapToResponse(discount);
        }

        public async Task<DiscountResponse?> ToggleActiveAsync(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null) return null;

            // Invierte el estado: si era true pasa a false, y viceversa
            discount.IsActive = !discount.IsActive;

            await _context.SaveChangesAsync();
            return MapToResponse(discount);
        }

        private DiscountResponse MapToResponse(Discount discount)
        {
            return new DiscountResponse
            {
                Id = discount.Id,
                Name = discount.Name,
                Type = discount.Type,
                DiscountAmount = discount.DiscountAmount,
                IsActive = discount.IsActive
            };
        }
    }
}