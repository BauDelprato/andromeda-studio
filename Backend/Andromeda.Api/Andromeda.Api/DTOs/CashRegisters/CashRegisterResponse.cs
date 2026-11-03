namespace Andromeda.Api.DTOs.CashRegisters
{
    public class CashRegisterResponse
    {
        public int Id { get; set; }

        public DateOnly Date { get; set; }

        public DateTime OpenedAt { get; set; }

        public DateTime? ClosedAt { get; set; }

        public decimal OpeningBalance { get; set; }

        public decimal? ClosingBalance { get; set; }
    }
}
