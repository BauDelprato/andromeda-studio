using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Transactions
{
    public class UpdateTransactionRequest
    {
        public int? CategoryId { get; set; }
        public decimal? Amount { get; set; }
        public TransactionType? Type { get; set; }
        public PaymentMethod? Method { get; set; }
        public string? Notes { get; set; }
    }
}
