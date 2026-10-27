using Andromeda.Api.DTOs.Students;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly StudentService _studentService;

        public StudentsController(StudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentResponse>>> GetStudents()
        {
            var students = await _studentService.GetAllAsync();

            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentResponse>> GetStudent(int id)
        {
            var student = await _studentService.GetByIdAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        [HttpGet("dni/{dni}")]
        public async Task<ActionResult<StudentResponse>> GetStudentByDni(string dni)
        {
            var student = await _studentService.GetByDniAsync(dni);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<StudentResponse>>> SearchStudents(
            string? name,
            string? lastName)
        {
            var students = await _studentService.SearchAsync(name, lastName);

            return Ok(students);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<StudentResponse>> UpdateStudent(
            int id,
            UpdateStudentRequest request)
        {
            try
            {
                var student = await _studentService.UpdateAsync(id, request);

                if (student == null)
                {
                    return NotFound();
                }

                return Ok(student);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPatch("{id}/deactivate")]
        public async Task<ActionResult<StudentResponse>> DeactivateStudent(int id)
        {
            var student = await _studentService.DeactivateAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        [HttpPatch("{id}/activate")]
        public async Task<ActionResult<StudentResponse>> ActivateStudent(int id)
        {
            var student = await _studentService.ActivateAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        [HttpPost]
        public async Task<ActionResult<StudentResponse>> CreateStudent(
            CreateStudentRequest request)
        {
            try
            {
                var student = await _studentService.CreateAsync(request);

                return CreatedAtAction(
                    nameof(GetStudent),
                    new { id = student.Id },
                    student);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }
    }
}