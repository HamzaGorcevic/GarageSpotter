using AutoHub.Dtos;
using AutoHub.Models;

namespace AutoHub.Data
{
    public interface IAuthRepository
    {
        public Task<ServiceResponse<string>> Login(LoginDto loginDto);
        public Task<ServiceResponse<string>> Register(RegisterDto registerDto);
        public Task<ServiceResponse<string>> ChangePassword(ChangePasswordDto changePasswordDto);
        public Task<ServiceResponse<User>> EditUser(UpdateUserDto updateUserDto);
        public Task<ServiceResponse<string>> DeleteProfile(string password);
    }
}
