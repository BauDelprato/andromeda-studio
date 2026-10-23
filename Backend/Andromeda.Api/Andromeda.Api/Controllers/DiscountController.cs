using Andromeda.Api.DTOs.Discounts;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiscountController : ControllerBase
    {
        private readonly DiscountService _discountService;

        public DiscountController(DiscountService discountService)
        {
            _discountService = discountService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DiscountResponse>>> GetDiscounts()
        {
            var discounts = await _discountService.GetAllAsync();
            return Ok(discounts);
        }

        [HttpPost]
        public async Task<ActionResult<DiscountResponse>> CreateDiscount(CreateDiscountRequest request)
        {
            try
            {
                var discount = await _discountService.CreateAsync(request);
                return Created(string.Empty, discount);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/toggle")]
        public async Task<ActionResult<DiscountResponse>> ToggleDiscount(int id)
        {
            var discount = await _discountService.ToggleActiveAsync(id);
            if (discount == null) return NotFound();

            return Ok(discount);
        }
    }
}