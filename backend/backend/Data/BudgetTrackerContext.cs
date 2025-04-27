using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class BudgetTrackerContext : IdentityDbContext<ApplicationUser>
{
    public BudgetTrackerContext(DbContextOptions<BudgetTrackerContext> options)
        : base(options) { }

    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Category> Categories { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Transaction>()
               .HasOne(t => t.User)
               .WithMany(u => u.Transactions)
               .HasForeignKey(t => t.UserId)
               .IsRequired();
    }
}
