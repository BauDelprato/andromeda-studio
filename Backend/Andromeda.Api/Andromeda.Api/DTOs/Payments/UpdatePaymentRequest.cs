using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Payments
{
    public class UpdatePaymentRequest
    {
        public PaymentMethod? Method { get; set; }
        public string? Notes { get; set; }
        public string? TransactionReference { get; set; }
    }
}
