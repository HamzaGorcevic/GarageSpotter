using System.ComponentModel.DataAnnotations;

namespace AutoHub.Dtos
{
    public class LoginDto
    {
        public string? Email { get; set; } = string.Empty;

        public string ?Password { get; set; } = string.Empty;

        public bool? IsGoogleLogin { get; set; } = false;

        public string? GoogleToken { get; set; }
    }
}