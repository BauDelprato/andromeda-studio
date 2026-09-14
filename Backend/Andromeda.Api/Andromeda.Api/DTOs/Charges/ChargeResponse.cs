using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Charges
{
    public class ChargeResponse
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public ChargeType Type { get; set; }

        public decimal Amount { get; set; }

        public decimal DiscountAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public DateOnly? BillingPeriod { get; set; }

        public ChargeStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public int? StudentCrewId { get; set; }
    }
}