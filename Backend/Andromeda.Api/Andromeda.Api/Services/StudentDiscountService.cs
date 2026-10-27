using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Discounts;
using Andromeda.Api.DTOs.Payments;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class StudentDiscountService
    {
        private readonly ApplicationDbContext _context;

        public StudentDiscountService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DiscountResponse>> GetDiscountsByStudentAsync(int studentId)
        {
            return await _context.StudentDiscounts
                .AsNoTracking()
                .Where(sd => sd.StudentId == studentId && sd.Discount.IsActive)
                .Select(sd => new DiscountResponse
                {
                    Id = sd.Discount.Id,
                    Name = sd.Discount.Name,
                    Type = sd.Discount.Type,
                    DiscountAmount = sd.Discount.DiscountAmount,
                    IsActive = sd.Discount.IsActive
                })
                .ToListAsync();
        }

        public async Task AssignDiscountAsync(int studentId, int discountId)
        {
            var studentExists = await _context.Students.AnyAsync(s => s.Id == studentId);
            if (!studentExists) throw new InvalidOperationException("El estudiante no existe.");

            var discountExists = await _context.Discounts.AnyAsync(d => d.Id == discountId);
            if (!discountExists) throw new InvalidOperationException("El descuento no existe.");

            var alreadyAssigned = await _context.StudentDiscounts
                .AnyAsync(sd => sd.StudentId == studentId && sd.DiscountId == discountId);

            if (!alreadyAssigned)
            {
                _context.StudentDiscounts.Add(new StudentDiscount
                {
                    StudentId = studentId,
                    DiscountId = discountId
                });
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveDiscountAsync(int studentId, int discountId)
        {
            var studentDiscount = await _context.StudentDiscounts
                .FirstOrDefaultAsync(sd => sd.StudentId == studentId && sd.DiscountId == discountId);

            if (studentDiscount != null)
            {
                _context.StudentDiscounts.Remove(studentDiscount);
                await _context.SaveChangesAsync();
            }
        }
    }
}