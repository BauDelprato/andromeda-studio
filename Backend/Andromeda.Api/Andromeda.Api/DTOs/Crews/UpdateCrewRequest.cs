using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Crews
{
    public class UpdateCrewRequest
    {
        public string? Name { get; set; }
        public CrewLevel? Level { get; set; }
        public CrewAge? Age { get; set; }
        public CrewSize? Size { get; set; }
    }
}