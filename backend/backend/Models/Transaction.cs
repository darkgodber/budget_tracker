using backend.Models;

public class Transaction
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    // true - доход, false - расход
    public bool IsIncome { get; set; }
    public string Category { get; set; }
}