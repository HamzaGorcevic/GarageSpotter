using System.Threading.Tasks;

namespace AutoHub.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string email, string verificationLink);
        Task SendResetPasswordEmailAsync(string email, string verificationLink);
    }
}