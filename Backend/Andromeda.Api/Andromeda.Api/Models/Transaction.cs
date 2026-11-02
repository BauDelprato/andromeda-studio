namespace Andromeda.Api.Models
{
    public class Transaction
    {

        public int Id { get; set; }
        public int CashRegisterId { get; set; }
        public CashRegister CashRegister { get; set; } = null!;
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int? PaymentId { get; set; }
        public Payment? Payment { get; set; }
        public decimal Amount { get; set; }
        public TransactionType Type { get; set; }
        public PaymentMethod Method { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
    }

    public enum TransactionType
    {
        Income = 0,
        Expense = 1
    }
}
