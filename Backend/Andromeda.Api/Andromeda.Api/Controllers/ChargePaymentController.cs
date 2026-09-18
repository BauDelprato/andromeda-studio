using Andromeda.Api.DTOs.ChargePayment;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChargePaymentController : ControllerBase
    {
        private readonly ChargePaymentService _chargePaymentService;

        public ChargePaymentController(ChargePaymentService chargePaymentService)
        {
            _chargePaymentService = chargePaymentService;
        }
        

    }
}
