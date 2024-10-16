using AutoHub.Dtos;
using AutoHub.Models;

namespace AutoHub.Services
{
    public interface IGarageSpotService
    {
        Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpots();
        Task<ServiceResponse<GarageSpotDto>> GetGarageSpot(int garageSpotId);
        Task<ServiceResponse<int>> CreateGarageSpot(CreateGarageSpotDto newSpot);
        Task<ServiceResponse<List<GarageSpot>>> GetOwnerGarageSpots();
        Task<ServiceResponse<bool>> DeleteGarageSpot(int spotId);
    }
}
