namespace Andromeda.Api.Models
{
    public class StudentCrew
    {
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;
        public int CrewId { get; set; }
        public Crew Crew { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
