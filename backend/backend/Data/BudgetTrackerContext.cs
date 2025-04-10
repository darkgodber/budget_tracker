using backend.Models;
using Microsoft.EntityFrameworkCore;

public class BudgetTrackerContext : DbContext
{
    public BudgetTrackerContext(DbContextOptions<BudgetTrackerContext> options)
        : base(options) { }

    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Category> Categories { get; set; }
}
