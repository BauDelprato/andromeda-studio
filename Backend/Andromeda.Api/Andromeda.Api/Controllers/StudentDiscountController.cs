using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentDiscountController : ControllerBase
    {
        private readonly StudentDiscountService _studentDiscountService;

        public StudentDiscountController(StudentDiscountService studentDiscountService)
        {
            _studentDiscountService = studentDiscountService;
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetByStudent(int studentId)
        {
            var discounts = await _studentDiscountService.GetDiscountsByStudentAsync(studentId);
            return Ok(discounts);
        }

        [HttpPost("{studentId}/{discountId}")]
        public async Task<IActionResult> Assign(int studentId, int discountId)
        {
            await _studentDiscountService.AssignDiscountAsync(studentId, discountId);
            return NoContent();
        }

        [HttpDelete("{studentId}/{discountId}")]
        public async Task<IActionResult> Remove(int studentId, int discountId)
        {
            await _studentDiscountService.RemoveDiscountAsync(studentId, discountId);
            return NoContent();
        }
    }
}