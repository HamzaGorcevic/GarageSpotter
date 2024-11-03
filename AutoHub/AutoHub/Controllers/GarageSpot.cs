using AutoHub.Dtos;
using AutoHub.Models;
using AutoHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

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
        [HttpGet("getGaragSspotsByCountry")]
        [Authorize(Roles = "User,Owner")]

        public async Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpotsByCountry(string country)
        {
            return await _garageSpotService.GetGarageSpotsByCountry(country);
        }

        [HttpGet("getgaragespots")]
        [Authorize(Roles = "User,Owner")]

        public async Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpots()
        {
            return await _garageSpotService.GetGarageSpots();
        }
        [HttpGet("getOwnerGarageSpots")]
        [Authorize(Roles = "Owner")]
        public async Task<ServiceResponse<List<GarageSpotDto>>> GetOwnerGarageSpots()
        {
            return await _garageSpotService.GetOwnerGarageSpots();
        }

        [HttpGet("getGarageSpot")]
        [Authorize(Roles = "User,Owner")]
        public async Task<ServiceResponse<GarageSpotDto>> GetGarageSpot(int garageSpotId)
        {
            return await _garageSpotService.GetGarageSpot(garageSpotId);
        }

        [HttpPut("updateGarageSpot")]
        [Authorize(Roles = "User,Owner")]

        public async Task<ServiceResponse<int>> UpdateGarageSpot([FromForm] IFormFile verificationDocument, [FromForm] List<IFormFile> garageImages, [FromForm] CreateGarageSpotDto updatedSpot,int garageSpotId)
        {
            return await _garageSpotService.UpdateGarageSpot( verificationDocument, garageImages,updatedSpot,garageSpotId);
        }
        
        [HttpPost("creategaragespot")]
        [Authorize(Roles = "Owner,User")]
        public async Task<ServiceResponse<int>> CreateGarageSpot([FromForm] IFormFile verificationDocument, [FromForm] List<IFormFile> garageImages, [FromForm] CreateGarageSpotDto newSpot)
        {
            return await _garageSpotService.CreateGarageSpot(verificationDocument,garageImages,newSpot);
        }

    

        [HttpDelete("ownerdeletegaragespot")]
        [Authorize(Roles = "Owner")]
        public async Task<ServiceResponse<bool>> OwnerDeleteGarageSpot(int spotId)
        {
            return await _garageSpotService.DeleteGarageSpot(spotId);
        }
    }
}
