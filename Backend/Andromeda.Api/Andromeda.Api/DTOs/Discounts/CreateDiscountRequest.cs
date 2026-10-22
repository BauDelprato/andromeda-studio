using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Discounts
{
    public class CreateDiscountRequest
    {
        public string Name { get; set; } = null!;
        public DiscountType Type { get; set; }
        public decimal DiscountAmount { get; set; }
    }
}