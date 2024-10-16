using AutoHub.Dtos;
using AutoHub.Models;
using AutoHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GarageSpotController : ControllerBase
    {
        private readonly IGarageSpotService _garageSpotService;

        public GarageSpotController(IGarageSpotService garageSpotService)
        {
            _garageSpotService = garageSpotService;
        }

        [HttpGet("getgaragespots")]
        public async Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpots()
        {
            return await _garageSpotService.GetGarageSpots();
        }
        [HttpGet("getownergaragespots")]
        [Authorize(Roles = "Owner")]
        public async Task<ServiceResponse<List<GarageSpot>>> GetOwnerGarageSpots()
        {
            return await _garageSpotService.GetOwnerGarageSpots();
        }

        [HttpGet("getGarageSpot")]
        [Authorize(Roles="User,Owner")]

        public async Task<ServiceResponse<GarageSpotDto>> GetGarageSpot(int garageSpotId)
        {
            return await _garageSpotService.GetGarageSpot(garageSpotId);
        }
        [HttpPost("creategaragespot")]
        [Authorize(Roles = "Owner")]
        public async Task<ServiceResponse<int>> CreateGarageSpot([FromBody] CreateGarageSpotDto garageSpotDto)
        {
            return await _garageSpotService.CreateGarageSpot(garageSpotDto);
        }

    

        [HttpDelete("ownerdeletegaragespot")]
        [Authorize(Roles = "Owner")]
        public async Task<ServiceResponse<bool>> OwnerDeleteGarageSpot(int spotId)
        {
            return await _garageSpotService.DeleteGarageSpot(spotId);
        }
    }
}
