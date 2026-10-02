using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChargeGenerationController : ControllerBase
    {
        private readonly ChargeGenerationService _chargeGenerationService;

        public ChargeGenerationController(
            ChargeGenerationService chargeGenerationService)
        {
            _chargeGenerationService = chargeGenerationService;
        }

        [HttpPost("registration/{studentId}")]
        public async Task<IActionResult> GenerateRegistration(
            int studentId,
            DateOnly? billingPeriod)
        {
            try
            {
                var period = billingPeriod ??
                    new DateOnly(DateTime.UtcNow.Year, 1, 1);

                var charge =
                    await _chargeGenerationService
                        .GenerateRegistrationChargeAsync(
                            studentId,
                            period);

                return Ok(charge);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("registration/annual")]
        public async Task<IActionResult> GenerateAnnualRegistration(
            DateOnly? billingPeriod)
        {
            try
            {
                var period = billingPeriod ??
                    new DateOnly(DateTime.UtcNow.Year, 1, 1);

                var generated =
                    await _chargeGenerationService
                        .GenerateAnnualRegistrationChargesAsync(period);

                return Ok(new
                {
                    GeneratedCharges = generated,
                    BillingPeriod = period
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("crew/monthly")]
        public async Task<IActionResult> GenerateMonthlyCrew(
            DateOnly? billingPeriod)
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.UtcNow);

                var period = billingPeriod ??
                    new DateOnly(today.Year, today.Month, 1);

                var generated =
                    await _chargeGenerationService
                        .GenerateMonthlyCrewChargesAsync(period);

                return Ok(new
                {
                    GeneratedCharges = generated,
                    BillingPeriod = period
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}