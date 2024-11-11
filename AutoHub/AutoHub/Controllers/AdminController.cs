using AutoHub.Dtos;
using AutoHub.Models;
using AutoHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Admin")]

    public class AdminController:ControllerBase
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;

        }

        [HttpGet("getGarages")]
        public async Task<ServiceResponse<List<GarageSpotDto>>> GetGarages()
        {
            var response = await _adminService.GetGarages();
            return response;

        }
        [HttpPut("verifyGarage")]
        public async Task<ServiceResponse<int>> VerifyGarage(VerifyGarageDto verifyGarageDto)
        {
            var response = await _adminService.VerifyGarage(verifyGarageDto);
            return response;

        }
        [HttpDelete("deleteGarage")]
        public async Task<ServiceResponse<int>> DeletGarage(int garageSpotId)
        {
            var response = await _adminService.DeleteGarage(garageSpotId);
            return response;
        }
        [HttpGet("getElectricChargers")]
        public async Task<ServiceResponse<List<ElectricCharger>>> GetElectricGarages()
        {
            var response = await _adminService.GetElectricChargers();
            return response;
        }
        [HttpPut("verifyElectricCharger")]
        public async Task<ServiceResponse<int>> VerifyElectricCharger(VerifyGarageDto verifyChargerDto)
        {
            var response = await _adminService.VerifyElectricCharger(verifyChargerDto);
            return response;
        }
        [HttpDelete("deleteElectricCharger")]
        public async Task<ServiceResponse<int>> DeleteElectricCharger(int chargerId)
        {
            var response = await _adminService.DeleteElectricCharger(chargerId);
            return response;
        }

        [HttpDelete("deleteUser")]
        public async Task<ServiceResponse<int>> DeleteUser(int userId)
        {
            var response = await _adminService.DeleteUser(userId);
            return response;
        }
        [HttpGet("getUsers")]
        public async Task<ServiceResponse<List<UserDto>>> getUsers()
        {
            var response = await _adminService.GetUsers();
            return response;
        }

    }
}
