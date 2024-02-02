using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportAcademy.BlazorApp.Server.ViewModels;
using SportAcademy.BlazorApp.Shared.Models;

namespace SportAcademy.BlazorApp.Server.Controllers.Data
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicantsController : ControllerBase
    {
        private readonly SportsEdgeDbContext _context;
        private readonly IWebHostEnvironment env;
        public ApplicantsController(SportsEdgeDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            this.env = env;
        }

        // GET: api/Applicants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Applicant>>> GetApplicants()
        {
            if (_context.Applicants == null)
            {
                return NotFound();
            }
            return await _context.Applicants.ToListAsync();
        }

        [HttpGet("Include")]
        public async Task<ActionResult<IEnumerable<Applicant>>> GetApplicantsWithEvents()
        {
            if (_context.Applicants == null)
            {
                return NotFound();
            }
            return await _context.Applicants.Include(x => x.Event).ToListAsync();
        }

        // GET: api/Applicants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Applicant>> GetApplicant(int id)
        {
            if (_context.Applicants == null)
            {
                return NotFound();
            }
            var applicant = await _context.Applicants.FindAsync(id);

            if (applicant == null)
            {
                return NotFound();
            }

            return applicant;
        }

        [HttpGet("{id}/Include")]
        public async Task<ActionResult<Applicant>> GetApplicantWithEvent(int id)
        {
            if (_context.Applicants == null)
            {
                return NotFound();
            }
            var applicant = await _context.Applicants.Include(x => x.Event).FirstOrDefaultAsync(x => x.ApplicantId == id);

            if (applicant == null)
            {
                return NotFound();
            }

            return applicant;
        }

        // PUT: api/Applicants/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplicant(int id, Applicant applicant)
        {
            if (id != applicant.ApplicantId)
            {
                return BadRequest();
            }

            _context.Entry(applicant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicantExists(id))
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

        // POST: api/Applicants
        [HttpPost]
        public async Task<ActionResult<Applicant>> PostApplicant(Applicant applicant)
        {
            if (_context.Applicants == null)
            {
                return Problem("Entity set 'SportsEdgeDbContext.Applicants' is null.");
            }

            _context.Applicants.Add(applicant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetApplicant", new { id = applicant.ApplicantId }, applicant);
        }

        // DELETE: api/Applicants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplicant(int id)
        {
            if (_context.Applicants == null)
            {
                return NotFound();
            }

            var applicant = await _context.Applicants.FindAsync(id);
            if (applicant == null)
            {
                return NotFound();
            }

            _context.Applicants.Remove(applicant);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        //Upload Image for Angular
        [HttpPost("Upload/{id}")]
        public async Task<ActionResult<UploadResponseModel>> Upload(int id, IFormFile file)
        {
            try
            {
                var applicant = await _context.Applicants.FirstOrDefaultAsync(x => x.ApplicantId == id);
                if (applicant == null) return NotFound();

                string ext = Path.GetExtension(file.FileName);
                string fileName = Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + ext;
                string savePath = Path.Combine(this.env.WebRootPath, "Pictures", fileName);

                if (!Directory.Exists(Path.Combine(this.env.WebRootPath, "Pictures")))
                {
                    Directory.CreateDirectory(Path.Combine(this.env.WebRootPath, "Pictures"));
                }

                using (FileStream fs = new FileStream(savePath, FileMode.Create))
                {
                    await file.CopyToAsync(fs);
                }

                applicant.Picture = fileName;
                await _context.SaveChangesAsync();
                return new UploadResponseModel { ImageName = fileName };
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error uploading file: {ex.Message}");
                return BadRequest("Error uploading file");
            }
        }
        private bool ApplicantExists(int id)
        {
            return (_context.Applicants?.Any(e => e.ApplicantId == id)).GetValueOrDefault();
        }
    }
}
