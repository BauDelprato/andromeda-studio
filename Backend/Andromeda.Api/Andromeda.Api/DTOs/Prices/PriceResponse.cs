using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Prices
{
    public class PriceResponse
    {
        public int Id { get; set; }

        public PriceType Type { get; set; }

        public CrewLevel? CrewLevel { get; set; }

        public decimal Amount { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}