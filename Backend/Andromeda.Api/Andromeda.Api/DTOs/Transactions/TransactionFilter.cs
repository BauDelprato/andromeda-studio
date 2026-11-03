using Andromeda.Api.Models;

namespace Andromeda.Api.DTOs.Transactions
{
    public class TransactionFilter
    {
        public int? CashRegisterId { get; set; }

        public int? CategoryId { get; set; }

        public TransactionType? Type { get; set; }

        public PaymentMethod? Method { get; set; }

        public DateTime? CreatedFromUtc { get; set; }

        public DateTime? CreatedToUtc { get; set; }
    }
}
