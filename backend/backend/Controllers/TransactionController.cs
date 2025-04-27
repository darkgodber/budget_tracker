using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Security.Claims;
using backend.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly BudgetTrackerContext _context;
    public TransactionsController(BudgetTrackerContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> Get()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var txs = await _context.Transactions
                                 .Where(t => t.UserId == userId)
                                 .ToListAsync();
        return Ok(txs);
    }

    [HttpPost]
    public async Task<ActionResult<Transaction>> Create([FromBody] CreateTransactionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var transaction = new Transaction
        {
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description,
            IsIncome = dto.IsIncome,
            Category = dto.Category,
            UserId = userId
        };
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = transaction.Id }, transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var tx = await _context.Transactions.FindAsync(id);
        if (tx == null || tx.UserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
            return NotFound();
        _context.Transactions.Remove(tx);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
