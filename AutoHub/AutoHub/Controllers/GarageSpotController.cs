﻿using AutoHub.Dtos;
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

        public async Task<ServiceResponse<int>> UpdateGarageSpot([FromForm] List<IFormFile> garageImages, [FromForm] List<string> existingImages,[FromForm] CreateGarageSpotDto updatedSpot,int garageSpotId)
        {
            return await _garageSpotService.UpdateGarageSpot( garageImages,existingImages,updatedSpot,garageSpotId);
        }
        
        [HttpPost("creategaragespot")]
        [Authorize(Roles = "Owner,User")]
        public async Task<ServiceResponse<string>> CreateGarageSpot([FromForm] IFormFile verificationDocument, [FromForm] List<IFormFile> garageImages, [FromForm] CreateGarageSpotDto newSpot)
        {
            return await _garageSpotService.CreateGarageSpot(verificationDocument,garageImages,newSpot);
        }

    

        [HttpDelete("deleteGarageSpot")]
        [Authorize(Roles = "Owner")]
        public async Task<ServiceResponse<bool>> OwnerDeleteGarageSpot(int spotId)
        {
            return await _garageSpotService.DeleteGarageSpot(spotId);
        }
    }
}
