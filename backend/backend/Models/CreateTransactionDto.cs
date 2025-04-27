namespace backend.Models
{
    public class CreateTransactionDto
    {
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsIncome { get; set; }
        public string Category { get; set; } = string.Empty;
    }
}
