using System.Threading.Tasks;

namespace AutoHub.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string email, string verificationLink);
    }
}