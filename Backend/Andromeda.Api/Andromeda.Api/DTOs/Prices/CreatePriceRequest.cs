using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Prices
{
    public class CreatePriceRequest
    {
        public PriceType Type { get; set; }

        public CrewLevel? CrewLevel { get; set; }

        public decimal Amount { get; set; }
    }
}