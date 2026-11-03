using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Categories;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class CategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoryResponse>> GetAllAsync()
        {
            var categories = await _context.Categories
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .ToListAsync();

            return categories
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<CategoryResponse?> GetByIdAsync(int id)
        {
            var category = await _context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            return category == null
                ? null
                : MapToResponse(category);
        }

        public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request)
        {
            var name = NormalizeName(request.Name);

            var description = NormalizeDescription(request.Description);

            var alreadyExists = await _context.Categories
                .AnyAsync(c => c.Name.ToLower() == name.ToLower());

            if (alreadyExists)
            {
                throw new InvalidOperationException(
                    "Ya existe una categoría con ese nombre.");
            }

            var category = new Category
            {
                Name = name,
                Description = description,
                SystemCode = null,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(category);

            await _context.SaveChangesAsync();

            return MapToResponse(category);
        }

        public async Task<CategoryResponse?> UpdateAsync(int id, UpdateCategoryRequest request)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return null;
            }

            if (request.Name != null)
            {
                var name = NormalizeName(request.Name);

                var alreadyExists = await _context.Categories
                    .AnyAsync(c =>
                        c.Id != id &&
                        c.Name.ToLower() == name.ToLower());

                if (alreadyExists)
                {
                    throw new InvalidOperationException(
                        "Ya existe otra categoría con ese nombre.");
                }

                category.Name = name;
            }

            if (request.Description != null)
            {
                category.Description = NormalizeDescription(
                    request.Description);
            }

            if (request.IsActive.HasValue)
            {
                if (!request.IsActive.Value &&
                    !string.IsNullOrEmpty(category.SystemCode))
                {
                    throw new InvalidOperationException(
                        "No se pueden desactivar categorías protegidas del sistema.");
                }

                category.IsActive = request.IsActive.Value;
            }

            if (request.Name == null &&
                request.Description == null &&
                !request.IsActive.HasValue)
            {
                throw new InvalidOperationException(
                    "Debe proporcionar al menos un campo para actualizar.");
            }

            await _context.SaveChangesAsync();

            return MapToResponse(category);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(category.SystemCode))
            {
                throw new InvalidOperationException(
                    "No se pueden eliminar categorías protegidas del sistema.");
            }

            category.IsActive = false;

            await _context.SaveChangesAsync();

            return true;
        }

        private static string NormalizeName(string? name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new InvalidOperationException(
                    "El nombre de la categoría es obligatorio.");
            }

            return name.Trim();
        }

        private static string? NormalizeDescription(string? description)
        {
            return string.IsNullOrWhiteSpace(description)
                ? null
                : description.Trim();
        }

        private static CategoryResponse MapToResponse(Category category)
        {
            return new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                SystemCode = category.SystemCode,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt
            };
        }
    }
}