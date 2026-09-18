using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.ChargePayment
{
    public class ChargePaymentResponse
    {
        public int ChargeId { get; set; }
        public ChargeStatus Status { get; set; }
        public decimal Amount { get; set; }
        public decimal DiscountAmount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}