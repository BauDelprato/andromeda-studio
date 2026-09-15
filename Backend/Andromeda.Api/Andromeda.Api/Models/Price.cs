namespace Andromeda.Api.Models
{
    public class Price
    {
        public int Id { get; set; }

        public PriceType Type { get; set; }

        public CrewLevel? CrewLevel { get; set; }

        public decimal Amount { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum PriceType
    {
        Registration,
        Crew,
        ClassSession,
        ClassPackage,
        BoxSession,
        BoxPackage
    }
}