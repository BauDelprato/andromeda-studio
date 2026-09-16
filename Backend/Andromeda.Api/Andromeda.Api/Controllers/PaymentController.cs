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

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
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
                var payment = await _paymentService.CreateAsync(request);

                return Created(string.Empty, payment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}