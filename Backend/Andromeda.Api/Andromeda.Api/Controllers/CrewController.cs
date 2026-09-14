using Andromeda.Api.DTOs.Crews;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CrewsController : ControllerBase
    {
        private readonly CrewService _crewService;

        public CrewsController(CrewService crewService)
        {
            _crewService = crewService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CrewResponse>>> GetCrews()
        {
            var crews = await _crewService.GetAllAsync();

            return Ok(crews);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CrewResponse>> GetCrew(int id)
        {
            var crew = await _crewService.GetByIdAsync(id);

            if (crew == null)
            {
                return NotFound();
            }

            return Ok(crew);
        }

        [HttpPost]
        public async Task<ActionResult<CrewResponse>> CreateCrew(
            CreateCrewRequest request)
        {
            var crew = await _crewService.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetCrew),
                new { id = crew.Id },
                crew);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<CrewResponse>> UpdateCrew(
            int id,
            UpdateCrewRequest request)
        {
            var crew = await _crewService.UpdateAsync(id, request);

            if (crew == null)
            {
                return NotFound();
            }

            return Ok(crew);
        }
    }
}