using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Payments
{
    public class CreatePaymentRequest
    {
        public int StudentId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public PaymentMethod Method { get; set; }
    }
}