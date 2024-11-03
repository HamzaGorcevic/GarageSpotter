using AutoHub.Dtos;
using AutoHub.Models;
using Microsoft.AspNetCore.Mvc;

namespace AutoHub.Services
{
    public interface IGarageSpotService
    {
        Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpotsByCountry(string country);
        Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpots();
        Task<ServiceResponse<GarageSpotDto>> GetGarageSpot(int garageSpotId);

        Task<ServiceResponse<int>> CreateGarageSpot([FromForm] IFormFile verificationDocument, [FromForm] List<IFormFile> garageImages, [FromForm] CreateGarageSpotDto newSpot);
        Task<ServiceResponse<List<GarageSpotDto>>> GetOwnerGarageSpots();
        Task<ServiceResponse<bool>> DeleteGarageSpot(int spotId);
        Task<ServiceResponse<int>> UpdateGarageSpot([FromForm] IFormFile verificationDocument, [FromForm] List<IFormFile> garageImages, [FromForm] CreateGarageSpotDto updatedSpot,int garageSpotId);
    }
}
