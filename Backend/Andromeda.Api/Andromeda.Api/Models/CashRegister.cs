namespace Andromeda.Api.Models
{
    public class CashRegister
    {

        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public DateTime OpenedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
        public decimal OpeningBalance { get; set; }
        public decimal? ClosingBalance { get; set; }
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
