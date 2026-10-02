using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.ChargePayment
{
    public class ChargePaymentResponse
    {
        public int ChargeId { get; set; }
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public ChargeStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
