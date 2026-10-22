using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Discounts
{
    public class DiscountResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DiscountType Type { get; set; }
        public decimal DiscountAmount { get; set; }
        public bool IsActive { get; set; }
    }
}