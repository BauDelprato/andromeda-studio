namespace Andromeda.Api.Models
{
    public class Charge
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public ChargeType Type { get; set; }

        public decimal Amount { get; set; }
        public decimal DiscountAmount { get; set; }

        public int? PriceId { get; set; }
        public Price? Price { get; set; }

        public DateOnly? BillingPeriod { get; set; }

        public ChargeStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? StudentCrewId { get; set; }
        public StudentCrew? StudentCrew { get; set; }

        public int? ClassSessionId { get; set; }
        //public ClassSession? ClassSession { get; set; }

        public int? ClassPackageId { get; set; }
        //public ClassPackage? ClassPackage { get; set; }

        public int? BoxSessionId { get; set; }
        //public BoxSession? BoxSession { get; set; }

        public int? BoxPackageId { get; set; }
        //public BoxPackage? BoxPackage { get; set; }
    }

    public enum ChargeType
    {
        Registration,
        Crew,
        ClassSession,
        ClassPackage,
        BoxSession,
        BoxPackage
    }

    public enum ChargeStatus
    {
        Pending,
        Paid,
        PartiallyPaid,
        Expired,
        Cancelled
    }
}