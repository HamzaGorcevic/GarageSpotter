using AutoHub.Data;
using AutoHub.Dtos;
using AutoHub.Models;
using Microsoft.AspNetCore.Mvc;

namespace AutoHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController
    {
        private readonly IAuthRepository _authRepository;
        public UserController(IAuthRepository authRepository) {
            _authRepository = authRepository;
        }
        [HttpPut("edit")]
        public async Task<ServiceResponse<User>> EditUser(UpdateUserDto updateUserDto)
        {
            var response = await _authRepository.EditUser(updateUserDto);
            return response;
        }

        [HttpPut("changePassword")]
        public async Task<ServiceResponse<string>> ChangePassword(ChangePasswordDto  changePasswordDto)
        {
            var response = await _authRepository.ChangePassword(changePasswordDto);
            return response;
        }

    }
}
