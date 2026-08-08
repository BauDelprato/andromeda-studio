namespace Andromeda.Api.Models
{
    public class Crew
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public CrewType Type { get; set; }


    }

    public enum CrewType
    {
        Recreational,
        Competitive,
        Elite
    }

}
