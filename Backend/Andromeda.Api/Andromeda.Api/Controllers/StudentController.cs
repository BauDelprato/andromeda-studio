using Andromeda.Api.DTOs.Students;
using Andromeda.Api.Models;
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

        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent([FromBody] CreateStudentRequest request)
        {
            var student = await _studentService.CreateAsync(request);

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            var students = await _studentService.GetAllAsync();

            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _studentService.GetByIdAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        [HttpGet("dni/{dni}")]
        public async Task<ActionResult<Student>> GetStudentByDni(string dni)
        {
            var student = await _studentService.GetByDniAsync(dni);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Student>>> SearchStudents(
            string? name,
            string? lastName)
        {
            var students = await _studentService.SearchAsync(name, lastName);

            return Ok(students);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<Student>> UpdateStudent(
            int id,
            UpdateStudentRequest request)
        {
            var student = await _studentService.UpdateAsync(id, request);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }
    }
}