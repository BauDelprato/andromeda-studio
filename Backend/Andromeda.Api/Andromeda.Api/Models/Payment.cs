namespace Andromeda.Api.Models
{
    public class Payment
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public Student Student { get; set; } = null!;

        public int CrewId { get; set; }

        public Crew Crew { get; set; } = null!;

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }

        public PaymentMethod Method { get; set; }
    }

    public enum PaymentMethod
    {
        Cash,
        Transfer
    }

}
