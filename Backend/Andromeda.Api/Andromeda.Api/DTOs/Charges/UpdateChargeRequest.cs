using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Charges
{
    public class UpdateChargeRequest
    {
        public decimal? Amount { get; set; }

        public decimal? DiscountAmount { get; set; }

        public DateOnly? BillingPeriod { get; set; }

        public ChargeStatus? Status { get; set; }
    }
}