using Andromeda.Api.Data;
using Andromeda.Api.DTOs.StudentCrews;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class StudentCrewService
    {
        private readonly ApplicationDbContext _context;
        private readonly ChargeGenerationService _chargeGenerationService;

        public StudentCrewService(ApplicationDbContext context, ChargeGenerationService chargeGenerationService)
        {
            _context = context;
            _chargeGenerationService = chargeGenerationService;
        }


        // GetAllAsync

        public async Task<List<StudentCrewResponse>> GetAllAsync()
        {
            var  studentCrew = await _context.StudentCrew.ToListAsync();

            return studentCrew
                .Select(MapToResponse)
                .ToList();

        }

        //CreteAsync
        public async Task<StudentCrewResponse> CreateAsync(CreateStudentCrewRequest request)
        {


            if (await _context.StudentCrew.AnyAsync(sc => sc.StudentId == request.StudentId && sc.CrewId == request.CrewId))
            {
                throw new InvalidOperationException("Este estudiante ya fue asignado a esta crew.");
            }


            var studentCrew = new StudentCrew
            {
                StudentId = request.StudentId,
                CrewId = request.CrewId
            };

            _context.StudentCrew.Add(studentCrew);
            await _context.SaveChangesAsync();

            await _chargeGenerationService.GenerateYearlyCrewChargesAsync(
                studentCrew.StudentId,
                studentCrew.CrewId,
                studentCrew.Id);

            return MapToResponse(studentCrew);
        }

        public async Task DeleteAsync(int studentId, int crewId)
        {
            var studentCrew = await _context.StudentCrew
                .FirstOrDefaultAsync(sc => sc.StudentId == studentId && sc.CrewId == crewId);

            if (studentCrew == null)
            {
                throw new InvalidOperationException("El estudiante no está asignado a esta crew.");
            }

            _context.StudentCrew.Remove(studentCrew);
            await _context.SaveChangesAsync();
        }

        private StudentCrewResponse MapToResponse(StudentCrew studentCrew)
        {
            return new StudentCrewResponse
            {
                Id = studentCrew.Id,
                StudentId = studentCrew.StudentId,
                CrewId = studentCrew.CrewId
            };
        }
    }
}