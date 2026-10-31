namespace Andromeda.Api.Models
{
    public class Category
    {

        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? SystemCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    }
}
