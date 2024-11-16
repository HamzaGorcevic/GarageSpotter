using AutoHub.Data;
using AutoHub.Dtos;
using AutoHub.Models;
using AutoHub.Services;
using Microsoft.AspNetCore.Mvc;

namespace AutoHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController
    {
        private readonly IAuthRepository _authRepository;
        private readonly IGarageSpotService _garageSpotService;
        public UserController(IAuthRepository authRepository, IGarageSpotService garageSpotService)
        {
            _authRepository = authRepository;
            _garageSpotService = garageSpotService;
        }
        [HttpGet("favoriteSpots")]
        public async Task<ServiceResponse<List<GarageSpotDto>>> GetFavorites()
        {
            var response = await _garageSpotService.GetFavorites();
            return response;

        }
        [HttpPost("addToFavorites")]
        public async Task<ServiceResponse<string>> AddToFavorites(int garageSpotId)
        {
            var response = await _garageSpotService.AddToFavorites(garageSpotId);
            return response;
        }
        [HttpDelete("removeFromFavorites")]
        public async Task<ServiceResponse<int>> RemoveFromFavorites(int garageSpotId)
        {
            var response = await _garageSpotService.RemoveFromFavorites(garageSpotId);
            return response;
        }

        [HttpPut("edit")]
        public async Task<ServiceResponse<User>> EditUser(UpdateUserDto updateUserDto)
        {
            var response = await _authRepository.EditUser(updateUserDto);
            return response;
        }

        [HttpPut("changePassword")]
        public async Task<ServiceResponse<string>> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var response = await _authRepository.ChangePassword(changePasswordDto);
            return response;
        }

    }
}
