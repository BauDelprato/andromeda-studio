using Andromeda.Api.DTOs.Prices;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PriceController : ControllerBase
    {
        private readonly PriceService _priceService;

        public PriceController(PriceService priceService)
        {
            _priceService = priceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PriceResponse>>> GetPrices()
        {
            var prices = await _priceService.GetAllAsync();

            return Ok(prices);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PriceResponse>> GetPrice(int id)
        {
            var price = await _priceService.GetByIdAsync(id);

            if (price == null)
            {
                return NotFound();
            }

            return Ok(price);
        }

        [HttpPost]
        public async Task<ActionResult<PriceResponse>> CreatePrice(
            CreatePriceRequest request)
        {
            try
            {
                var price = await _priceService.CreateAsync(request);

                return CreatedAtAction(
                    nameof(GetPrice),
                    new { id = price.Id },
                    price);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<PriceResponse>> UpdatePrice(
            int id,
            UpdatePriceRequest request)
        {
            try
            {
                var price = await _priceService.UpdateAsync(id, request);

                if (price == null)
                {
                    return NotFound();
                }

                return Ok(price);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}