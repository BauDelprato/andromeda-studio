namespace Andromeda.Api.Models
{
    public class StudentDiscount
    {
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public int DiscountId { get; set; }
        public Discount Discount { get; set; } = null!;
    }
}