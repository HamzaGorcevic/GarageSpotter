
using AutoHub.Data;
using AutoHub.Dtos;
using AutoHub.Models;
using Microsoft.AspNetCore.Mvc;

namespace AutoHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController
    {

        IAuthRepository _authRepository;
        public AuthController(IAuthRepository authRepository) {
            _authRepository = authRepository;
        
        }

        [HttpPost("login")]
        public async Task<ServiceResponse<string>> Login(LoginDto loginDto)
        {
            var response = await _authRepository.Login(loginDto);
            return response;

        }

        [HttpPost("register")]

        public async Task<ServiceResponse<string>> Register(RegisterDto registerDto)
        {
            var response = await (_authRepository.Register(registerDto));
            return response;    
        }


    }
}
