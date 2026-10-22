using System.ComponentModel.DataAnnotations;

namespace Andromeda.Api.DTOs
{
    public sealed class GenerateAnnualCrewChargesRequest
    {
        public int StudentId { get; init; }
        public int CrewId { get; init; }
        public int StudentCrewId { get; init; }
        public decimal Amount { get; init; }
    }
}