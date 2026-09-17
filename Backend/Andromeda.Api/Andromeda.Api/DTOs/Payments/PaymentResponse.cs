using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Payments
{
    public class PaymentResponse
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public PaymentMethod Method { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}