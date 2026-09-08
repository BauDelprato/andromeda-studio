namespace Andromeda.Api.Models
{
    public class Charge
    {

        public int Id { get; set; }
        public int StudentId { get; set; }
        public ChargeType Type { get; set; }
        public int? CrewId { get; set; }
        public int? ClassSessionId { get; set; }
        public int? ClassPackageId { get; set; }
        public int? BoxSessionId { get; set; }
        public int? BoxPackageId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public ChargeStatus Status { get; set; }
        public decimal Amount { get; set; }
        public decimal Discount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
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
