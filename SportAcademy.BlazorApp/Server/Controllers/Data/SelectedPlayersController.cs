using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportAcademy.BlazorApp.Shared.Models;

namespace SportAcademy.BlazorApp.Server.Controllers.Data
{
    [Route("api/[controller]")]
    [ApiController]
    public class SelectedPlayersController : ControllerBase
    {
        private readonly SportsEdgeDbContext _context;

        public SelectedPlayersController(SportsEdgeDbContext context)
        {
            _context = context;
        }

        // GET: api/SelectedPlayers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SelectedPlayer>>> GetSelectedPlayers()
        {
            if (_context.SelectedPlayers == null)
            {
                return NotFound();
            }
            return await _context.SelectedPlayers.ToListAsync();
        }

        [HttpGet("Include")]
        public async Task<ActionResult<IEnumerable<SelectedPlayer>>> GetSelectedPlayersWithEvents()
        {
            if (_context.SelectedPlayers == null)
            {
                return NotFound();
            }
            return await _context.SelectedPlayers.Include(x => x.Applicant).Include(x => x.Event).ToListAsync();
        }

        // GET: api/SelectedPlayers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SelectedPlayer>> GetSelectedPlayer(int id)
        {
            if (_context.SelectedPlayers == null)
            {
                return NotFound();
            }
            var selectedPlayer = await _context.SelectedPlayers.FindAsync(id);

            if (selectedPlayer == null)
            {
                return NotFound();
            }

            return selectedPlayer;
        }

        [HttpGet("{id}/Include")]
        public async Task<ActionResult<SelectedPlayer>> GetSelectedPlayerWithEvent(int id)
        {
            if (_context.SelectedPlayers == null)
            {
                return NotFound();
            }
            var selectedPlayer = await _context.SelectedPlayers.Include(x => x.Applicant).Include(x => x.Event).FirstOrDefaultAsync(x => x.SelectedPlayerId == id);

            if (selectedPlayer == null)
            {
                return NotFound();
            }

            return selectedPlayer;
        }

        // PUT: api/SelectedPlayers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSelectedPlayer(int id, SelectedPlayer selectedPlayer)
        {
            if (id != selectedPlayer.SelectedPlayerId)
            {
                return BadRequest();
            }

            _context.Entry(selectedPlayer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SelectedPlayerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SelectedPlayers
        [HttpPost]
        public async Task<ActionResult<SelectedPlayer>> PostSelectedPlayer(SelectedPlayer selectedPlayer)
        {
            if (_context.SelectedPlayers == null)
            {
                return Problem("Entity set 'SportsEdgeDbContext.SelectedPlayers' is null.");
            }

            _context.SelectedPlayers.Add(selectedPlayer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSelectedPlayer", new { id = selectedPlayer.SelectedPlayerId }, selectedPlayer);
        }

        // DELETE: api/SelectedPlayers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSelectedPlayer(int id)
        {
            if (_context.SelectedPlayers == null)
            {
                return NotFound();
            }

            var selectedPlayer = await _context.SelectedPlayers.FindAsync(id);
            if (selectedPlayer == null)
            {
                return NotFound();
            }

            _context.SelectedPlayers.Remove(selectedPlayer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SelectedPlayerExists(int id)
        {
            return (_context.SelectedPlayers?.Any(e => e.SelectedPlayerId == id)).GetValueOrDefault();
        }
    }
}
