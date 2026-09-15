using Andromeda.Api.DTOs.StudentCrews;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc; 


namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentCrewController : ControllerBase
    {
        private readonly StudentCrewService _studentCrewService;

        public StudentCrewController(StudentCrewService studentCrewService)
        {
            _studentCrewService = studentCrewService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentCrewResponse>>> GetStudentCrews()
        {
            var studentCrew = await _studentCrewService.GetAllAsync();

            return Ok(studentCrew);
        }

        //create StudentCrew instance
        [HttpPost]
        public async Task<ActionResult<StudentCrewResponse>> CreateStudentCrew(CreateStudentCrewRequest request)
        {
            try
            {
                var studentCrew = await _studentCrewService.CreateAsync(request);
                return CreatedAtAction(nameof(GetStudentCrews), new { id = studentCrew.Id }, studentCrew);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("{studentId}/{crewId}")]
        public async Task<IActionResult> DeleteStudentCrew(int studentId, int crewId)
        {
            // Implementation for deleting a StudentCrew instance
            return NoContent();
        }
    }
}