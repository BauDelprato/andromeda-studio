using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Transactions
{
    public class TransactionResponse
    {
        public int Id { get; set; }

        public int CashRegisterId { get; set; }

        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = string.Empty;

        public int? PaymentId { get; set; }

        public decimal Amount { get; set; }

        public TransactionType Type { get; set; }

        public PaymentMethod Method { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? Notes { get; set; }
    }
}
