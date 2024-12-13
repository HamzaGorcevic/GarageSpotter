using System.ComponentModel.DataAnnotations;

namespace AutoHub.Dtos
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public bool IsGoogleLogin { get; set; } = false;

        public string? GoogleToken { get; set; }
    }
}