using Andromeda.Api.Models;
using Andromeda.Api.DTOs.ChargePayment;

namespace Andromeda.Api.DTOs.Payments
{
    public class CreatePaymentRequest
    {
        public int StudentId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public PaymentMethod Method { get; set; }

        public string? Notes { get; set; }

        public string? TransactionReference { get; set; }

        public List<CreateChargePaymentRequest> Charges { get; set; } = new();
    }
}
