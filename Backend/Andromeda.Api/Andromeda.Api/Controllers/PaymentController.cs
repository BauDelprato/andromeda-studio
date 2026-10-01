using Andromeda.Api.DTOs.Payments;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;
        private readonly ChargePaymentService _chargePaymentService;

        public PaymentController(
            PaymentService paymentService,
            ChargePaymentService chargePaymentService)
        {
            _paymentService = paymentService;
            _chargePaymentService = chargePaymentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentResponse>>> GetPayments()
        {
            var payments = await _paymentService.GetAllAsync();

            return Ok(payments);
        }

        [HttpPost]
        public async Task<ActionResult<PaymentResponse>> CreatePayment(
            CreatePaymentRequest request)
        {
            try
            {
                var payment = await _chargePaymentService.CreateAsync(request);

                return Created(string.Empty, payment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UpdatePaymentResponse>> UpdatePayment(
            int id,
            UpdatePaymentRequest request)
        {
            try
            {
                var payment = await _paymentService.UpdateAsync(id, request);
                if (payment == null)
                {
                    return NotFound();
                }

                return Ok(payment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
