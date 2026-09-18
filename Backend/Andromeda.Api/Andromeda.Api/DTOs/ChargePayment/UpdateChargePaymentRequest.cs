using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.ChargePayment
{
    public class UpdateChargePaymentRequest
    {
        public int ChargeId { get; set; }
        public ChargeStatus Status { get; set; }
        public string? PaymentUrl { get; set; }
    }
}