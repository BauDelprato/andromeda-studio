namespace Andromeda.Api.Models
{
    public enum DiscountType
    {
        Percentage,
        FixedAmount
    }

    public class Discount
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DiscountType Type { get; set; }
        public decimal DiscountAmount { get; set; }
        public bool IsActive { get; set; } = true;
        public ICollection<PaymentDiscount> PaymentDiscounts { get; set; } = new List<PaymentDiscount>();
    }
}