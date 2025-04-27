using backend.Models;
using System.Text.Json.Serialization;

public class Transaction
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsIncome { get; set; }
    public string Category { get; set; } = string.Empty;
    
    // Идентификатор пользователя
    public string UserId { get; set; } = string.Empty;

    // Навигационное свойство игнорируем для JSON, EF заполнит его автоматически
    [JsonIgnore]
    public ApplicationUser User { get; set; } = null!;
}