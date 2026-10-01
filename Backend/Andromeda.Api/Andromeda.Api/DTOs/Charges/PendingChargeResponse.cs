using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Charges
{
    public class PendingChargeResponse
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public ChargeType Type { get; set; }
        public decimal Amount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal AmountDue { get; set; }
        public DateOnly? BillingPeriod { get; set; }
        public ChargeStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
