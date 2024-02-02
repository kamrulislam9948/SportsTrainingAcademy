using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NuGet.Common;
using SportAcademy.BlazorApp.Server.DataApi.ViewModels.Identity;
using SportAcademy.BlazorApp.Shared.Models;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SportAcademy.BlazorApp.Server.Controllers.Security
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly IConfiguration config;
        public readonly SportsEdgeDbContext db;
        public AccountController(UserManager<IdentityUser> userManager, IConfiguration config, SportsEdgeDbContext db)
        {
            this.userManager = userManager;
            this.config = config;
            this.db = db;
        }

        [Route("Register")]
        [HttpPost]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            var user = new IdentityUser
            {
                Email = model.Email,
                UserName = model.Username,
                PhoneNumber=model.PhoneNumber,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Players");
                return Ok(new { Username = user.UserName });
            }

            return BadRequest(result.Errors);
        }

        [Route("Login")]
        [HttpPost]
        public async Task<ActionResult> Login(LoginViewModel model)
        {
            var user = await FindUserAsync(model.Identifier);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var roles = await userManager.GetRolesAsync(user);
                var signingKey = Encoding.UTF8.GetBytes(config["Jwt:SigningKey"] ?? "IsDB-BISEW ESAD-54");
                var expiryDuration = int.Parse(config["Jwt:ExpiryInMinutes"] ?? "30");
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Issuer = null,
                    Audience = null,
                    IssuedAt = DateTime.UtcNow,
                    NotBefore = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddMinutes(expiryDuration),
                    Subject = new ClaimsIdentity(
                        new List<Claim> {
                    new Claim("username", user.UserName ?? ""),
                    new Claim("email", user.Email ?? ""),
                    new Claim("phone", user.PhoneNumber ?? ""),
                    new Claim("roles", string.Join(",", roles)),
                    new Claim("expires", DateTime.UtcNow.AddMinutes(expiryDuration).ToString("yyyy-MM-ddTHH:mm:ss"))
                        }
                    ),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(signingKey), SecurityAlgorithms.HmacSha256Signature)
                };
                var jwtTokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = jwtTokenHandler.CreateJwtSecurityToken(tokenDescriptor);
                var token = jwtTokenHandler.WriteToken(jwtToken);

                return Ok(new { Token = token });
            }

            // Log details for debugging
            if (user == null)
            {
                Console.WriteLine("User not found.");
            }
            else
            {
                Console.WriteLine("Password check failed.");
            }

            return BadRequest("Invalid login attempt");
        }

        private async Task<IdentityUser?> FindUserAsync(string identifier)
        {
            // Try finding the user by email
            var user = await userManager.FindByEmailAsync(identifier);

            // If not found, try finding by username
            if (user == null)
            {
                user = await userManager.FindByNameAsync(identifier);
            }

            // If still not found, try finding by phone number
            if (user == null && !string.IsNullOrEmpty(identifier) && new PhoneAttribute().IsValid(identifier))
            {
                user = await userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == identifier);
            }

            return user;
        }
    }
}
