using System.ComponentModel.DataAnnotations;

namespace SportAcademy.BlazorApp.Server.ViewModels.Identity
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = default!;
    }
}
