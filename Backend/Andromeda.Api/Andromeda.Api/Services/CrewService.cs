using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Crews;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class CrewService
    {
        private readonly ApplicationDbContext _context;

        public CrewService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CrewResponse>> GetAllAsync()
        {
            var crews = await _context.Crews
                .AsNoTracking()
                .ToListAsync();

            return crews
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<CrewResponse?> GetByIdAsync(int id)
        {
            var crew = await _context.Crews
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (crew == null)
            {
                return null;
            }

            return MapToResponse(crew);
        }

        public async Task<CrewResponse> CreateAsync(
            CreateCrewRequest request)
        {
            var crew = new Crew
            {
                Name = request.Name,
                Level = request.Level,
                Age = request.Age,
                Size = request.Size
            };

            _context.Crews.Add(crew);

            await _context.SaveChangesAsync();

            return MapToResponse(crew);
        }

        public async Task<CrewResponse?> UpdateAsync(
            int id,
            UpdateCrewRequest request)
        {
            var crew = await _context.Crews.FindAsync(id);

            if (crew == null)
            {
                return null;
            }

            if (request.Name != null)
            {
                crew.Name = request.Name;
            }

            if (request.Level.HasValue)
            {
                crew.Level = request.Level.Value;
            }

            if (request.Age.HasValue)
            {
                crew.Age = request.Age.Value;
            }

            if (request.Size.HasValue)
            {
                crew.Size = request.Size.Value;
            }

            await _context.SaveChangesAsync();

            return MapToResponse(crew);
        }

        private CrewResponse MapToResponse(Crew crew)
        {
            return new CrewResponse
            {
                Id = crew.Id,
                Name = crew.Name,
                Level = crew.Level,
                Age = crew.Age,
                Size = crew.Size
            };
        }
    }
}