namespace Andromeda.Api.DTOs.Prices
{
    public class UpdatePriceRequest
    {
        public decimal? Amount { get; set; }

        public DateOnly? ValidFrom { get; set; }

        public DateOnly? ValidTo { get; set; }
    }
}