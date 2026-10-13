namespace Andromeda.Api.DTOs.ChargePayment
{
    public class CreateChargePaymentRequest
    {
        public int ChargeId { get; set; }
        public decimal Amount { get; set; }
    }
}
