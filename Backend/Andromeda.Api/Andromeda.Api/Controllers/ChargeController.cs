using Andromeda.Api.DTOs.Charges;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChargeController : ControllerBase
    {
        private readonly ChargeService _chargeService;

        public ChargeController(ChargeService chargeService)
        {
            _chargeService = chargeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChargeResponse>>> GetCharges()
        {
            var charges = await _chargeService.GetAllAsync();

            return Ok(charges);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChargeResponse>> GetCharge(int id)
        {
            var charge = await _chargeService.GetByIdAsync(id);

            if (charge == null)
            {
                return NotFound();
            }

            return Ok(charge);
        }

        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<ChargeResponse>>> GetChargesByStudent(
            int studentId)
        {
            var charges = await _chargeService
                .GetByStudentIdAsync(studentId);

            return Ok(charges);
        }

        [HttpPost]
        public async Task<ActionResult<ChargeResponse>> CreateCharge(
            CreateChargeRequest request)
        {
            try
            {
                var charge = await _chargeService.CreateAsync(request);

                return CreatedAtAction(
                    nameof(GetCharge),
                    new { id = charge.Id },
                    charge);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ChargeResponse>> UpdateCharge(
            int id,
            UpdateChargeRequest request)
        {
            try
            {
                var charge = await _chargeService.UpdateAsync(id, request);

                if (charge == null)
                {
                    return NotFound();
                }

                return Ok(charge);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}