using AutoHub.Models;

namespace AutoHub.Data
{
    public interface IAuthRepository
    {
        public Task<ServiceResponse<string>> Login(LoginDto loginDto);
        public Task<ServiceResponse<string>> Register(RegisterDto registerDto);
    }
}
