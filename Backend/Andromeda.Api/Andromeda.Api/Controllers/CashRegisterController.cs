using Andromeda.Api.DTOs.CashRegisters;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CashRegisterController : ControllerBase
    {
        private readonly CashRegisterService _cashRegisterService;

        public CashRegisterController(CashRegisterService cashRegisterService)
        {
            _cashRegisterService = cashRegisterService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CashRegisterResponse>>> GetCashRegisters()
        {
            var cashRegisters = await _cashRegisterService.GetAllAsync();

            return Ok(cashRegisters);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CashRegisterResponse>> GetCashRegister(int id)
        {
            var cashRegister = await _cashRegisterService.GetByIdAsync(id);

            if (cashRegister == null)
            {
                return NotFound();
            }

            return Ok(cashRegister);
        }

        [HttpPost]
        public async Task<ActionResult<CashRegisterResponse>> CreateCashRegister()
        {
            try
            {
                var cashRegister = await _cashRegisterService.CreateAsync();

                return CreatedAtAction(
                    nameof(GetCashRegister),
                    new { id = cashRegister.Id },
                    cashRegister);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/close")]
        public async Task<ActionResult<CashRegisterResponse>> CloseCashRegister(int id)
        {
            try
            {
                var cashRegister = await _cashRegisterService.CloseAsync(id);

                if (cashRegister == null)
                {
                    return NotFound();
                }

                return Ok(cashRegister);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<CashRegisterResponse>> UpdateCashRegister(
            int id,
            UpdateCashRegisterRequest request)
        {
            try
            {
                var cashRegister = await _cashRegisterService.UpdateAsync(id, request);

                if (cashRegister == null)
                {
                    return NotFound();
                }

                return Ok(cashRegister);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCashRegister(int id)
        {
            try
            {
                var deleted = await _cashRegisterService.DeleteAsync(id);

                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}