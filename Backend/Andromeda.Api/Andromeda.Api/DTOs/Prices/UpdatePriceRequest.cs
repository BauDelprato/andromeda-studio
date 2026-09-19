namespace Andromeda.Api.DTOs.Prices
{
    public class UpdatePriceRequest
    {
        public decimal? Amount { get; set; }

        public bool? IsActive { get; set; }
    }
}