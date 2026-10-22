namespace Andromeda.Api.Models
{
    public class PaymentDiscount
    {
        public int PaymentId { get; set; }
        public Payment Payment { get; set; } = null!;

        public int DiscountId { get; set; }
        public Discount Discount { get; set; } = null!;
        public decimal AppliedAmount { get; set; }
    }
}