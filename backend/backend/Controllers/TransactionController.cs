using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly BudgetTrackerContext _context;

    public TransactionsController(BudgetTrackerContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        return await _context.Transactions.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Transaction>> CreateTransaction([FromBody] Transaction transaction) // <= важно! [FromBody]
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateTransaction), new { id = transaction.Id }, transaction);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransactionById(int id)
    {
        var transaction = await _context.Transactions.Include(t => t.Category)
                                                     .FirstOrDefaultAsync(t => t.Id == id);
        if (transaction == null)
        {
            return NotFound();
        }
        return transaction;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
        {
            return NotFound();
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }



}
