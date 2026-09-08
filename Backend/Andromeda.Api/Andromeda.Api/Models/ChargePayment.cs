namespace Andromeda.Api.Models
{
    public class ChargePayment
    {
        public int ChargeId { get; set; }
        public Charge Charge { get; set; } = null!;

        public int PaymentId { get; set; }
        public Payment Payment { get; set; } = null!;
    }
}
