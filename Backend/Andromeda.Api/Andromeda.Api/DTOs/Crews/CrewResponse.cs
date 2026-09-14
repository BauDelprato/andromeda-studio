using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Crews
{
    public class CrewResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public CrewLevel Level { get; set; }
        public CrewAge Age { get; set; }
        public CrewSize Size { get; set; }
    }
}