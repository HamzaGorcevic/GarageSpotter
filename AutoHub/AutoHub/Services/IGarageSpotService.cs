using AutoHub.Models;

namespace AutoHub.Services
{
    public interface IGarageSpotService
    {
        Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpots();
        Task<ServiceResponse<string>> CreateGarageSpot(GarageSpotDto newSpot);
        Task<ServiceResponse<List<GarageSpot>>> GetOwnerGarageSpots();
        Task<ServiceResponse<bool>> DeleteGarageSpot(int spotId);
    }
}
