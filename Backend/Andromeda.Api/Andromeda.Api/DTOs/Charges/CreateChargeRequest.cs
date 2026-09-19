using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Charges
{
    public class CreateChargeRequest
    {
        public int StudentId { get; set; }

        public ChargeType Type { get; set; }

        public decimal Amount { get; set; }

        public decimal DiscountAmount { get; set; }

        public DateOnly? BillingPeriod { get; set; }

        public int? StudentCrewId { get; set; }
    }
}