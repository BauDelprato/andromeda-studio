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

        public async Task<List<StudentResponse>> GetAllAsync()
        {
            var students = await _context.Students.ToListAsync();

            return students
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<StudentResponse?> GetByIdAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return null;
            }

            return MapToResponse(student);
        }

        public async Task<StudentResponse?> GetByDniAsync(string dni)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.DNI == dni);

            if (student == null)
            {
                return null;
            }

            return MapToResponse(student);
        }

        public async Task<List<StudentResponse>> SearchAsync(
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

            var students = await query.ToListAsync();

            return students
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<StudentResponse?> UpdateAsync(
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
                    throw new InvalidOperationException(
                        "El DNI ya pertenece a otro estudiante.");
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
                student.FitnessCertificate =
                    request.FitnessCertificate.Value;
            }

            if (request.Notes != null)
            {
                student.Notes = request.Notes;
            }

            await _context.SaveChangesAsync();

            return MapToResponse(student);
        }

        public async Task<StudentResponse> CreateAsync(
            CreateStudentRequest request)
        {
            var dniExists = await _context.Students
                .AnyAsync(s => s.DNI == request.DNI);

            if (dniExists)
            {
                throw new InvalidOperationException(
                    "El DNI ya pertenece a otro estudiante.");
            }

            var student = new Student
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                DNI = request.DNI,
                Phone = request.Phone,
                Email = request.Email,
                FitnessCertificate = request.FitnessCertificate,
                Notes = request.Notes,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Students.Add(student);

            await _context.SaveChangesAsync();

            return MapToResponse(student);
        }

        public async Task<StudentResponse?> DeactivateAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return null;
            }

            student.IsActive = false;

            await _context.SaveChangesAsync();

            return MapToResponse(student);
        }

        public async Task<StudentResponse?> ActivateAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return null;
            }

            student.IsActive = true;

            await _context.SaveChangesAsync();

            return MapToResponse(student);
        }

        private StudentResponse MapToResponse(Student student)
        {
            return new StudentResponse
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                DNI = student.DNI,
                Phone = student.Phone,
                Email = student.Email,
                FitnessCertificate = student.FitnessCertificate,
                Notes = student.Notes,
                IsActive = student.IsActive,
                CreatedAt = student.CreatedAt
            };
        }
    }
}