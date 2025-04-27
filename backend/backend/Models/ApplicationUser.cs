using Microsoft.AspNetCore.Identity;
namespace backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        // при желании можно расширить профилем
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
