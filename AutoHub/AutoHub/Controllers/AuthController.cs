using AutoHub.Data;
using AutoHub.Dtos;
using AutoHub.Models;
using Microsoft.AspNetCore.Mvc;

namespace AutoHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        [HttpPost("login")]
        public async Task<ActionResult<ServiceResponse<string>>> Login(LoginDto loginDto)
        {
            var response = await _authRepository.Login(loginDto);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<ActionResult<ServiceResponse<string>>> Register(RegisterDto registerDto)
        {
            var response = await _authRepository.Register(registerDto);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }
        [HttpGet("verify-email")]
        public async Task<ActionResult<ServiceResponse<string>>> VerifyEmail([FromQuery] string token)
        {
            var response = await _authRepository.VerifyEmail(token);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }
        [HttpGet("reset-password-request")]
        public async Task<ActionResult<ServiceResponse<string>>> ResetPasswordRequest(string email)
        {
            var respone = await _authRepository.ResetPasswordRequest(email);

            if (!respone.Success)
                return BadRequest(respone);
            return Ok(respone);
        }
        [HttpPost("reset-password")]
        public async Task<ActionResult<ServiceResponse<string>>> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var respone = await _authRepository.ResetPassword(resetPasswordDto);
            if (!respone.Success)
                return BadRequest(respone);
            return Ok(respone);
        }


    }
}
