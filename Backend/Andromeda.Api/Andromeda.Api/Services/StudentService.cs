using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Students;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class StudentService
    {
        private readonly ApplicationDbContext _context;

        public StudentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Student>> GetAllAsync()
        {
            return await _context.Students.ToListAsync();
        }

        public async Task<Student?> GetByIdAsync(int id)
        {
            return await _context.Students.FindAsync(id);
        }

        public async Task<Student?> GetByDniAsync(string dni)
        {
            return await _context.Students
                .FirstOrDefaultAsync(s => s.DNI == dni);
        }

        public async Task<List<Student>> SearchAsync(
            string? name,
            string? lastName)
        {
            var query = _context.Students.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(s => s.FirstName.Contains(name));
            }

            if (!string.IsNullOrWhiteSpace(lastName))
            {
                query = query.Where(s => s.LastName.Contains(lastName));
            }

            return await query.ToListAsync();
        }

        public async Task<Student?> UpdateAsync(
            int id,
            UpdateStudentRequest request)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return null;
            }

            if (request.DNI != null)
            {
                var dniExists = await _context.Students
                    .AnyAsync(s => s.DNI == request.DNI && s.Id != id);

                if (dniExists)
                {
                    throw new InvalidOperationException("El DNI ya pertenece a otro estudiante.");
                }

                student.DNI = request.DNI;
            }

            if (request.FirstName != null)
            {
                student.FirstName = request.FirstName;
            }

            if (request.LastName != null)
            {
                student.LastName = request.LastName;
            }

            if (request.Phone != null)
            {
                student.Phone = request.Phone;
            }

            if (request.Email != null)
            {
                student.Email = request.Email;
            }

            if (request.FitnessCertificate.HasValue)
            {
                student.FitnessCertificate = request.FitnessCertificate.Value;
            }

            if (request.Notes != null)
            {
                student.Notes = request.Notes;
            }

            if (request.IsActive.HasValue)
            {
                student.IsActive = request.IsActive.Value;
            }

            await _context.SaveChangesAsync();

            return student;
        }
    }
}