namespace Andromeda.Api.Models
{
    public class Payment
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public PaymentMethod Method { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    public enum PaymentMethod
    {
        Cash,
        Transfer
    }

}
