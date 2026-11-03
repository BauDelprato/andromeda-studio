namespace Andromeda.Api.DTOs.CashRegisters
{
    public class CreateCashRegisterRequest
    {
        public DateOnly Date { get; set; }
        public DateTime OpenedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
        public decimal OpeningBalance { get; set; }
        public decimal? ClosingBalance { get; set; }
    }
}
