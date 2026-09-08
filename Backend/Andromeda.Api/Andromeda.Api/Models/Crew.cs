namespace Andromeda.Api.Models
{
    public class Crew
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public CrewLevel Level { get; set; }
        public CrewAge Age { get; set; }
        public CrewSize Size { get; set; }

    }

    public enum CrewLevel
    {
        Recreational,
        Competitive,
        Elite
    }

    public enum CrewAge
    {
        Baby,
        JuniorA,
        JuniorB,
        VarsityA,
        VarsityAdult,
        Senior
    }

    public enum CrewSize
    {
        MiniCrew,
        Crew,
        MegaCrew
    }
}
