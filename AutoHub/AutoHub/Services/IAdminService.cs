using AutoHub.Dtos;
using AutoHub.Models;

namespace AutoHub.Services
{
    public interface IAdminService
    {
        Task<ServiceResponse<List<GarageSpotDto>>> GetGarages();
        Task<ServiceResponse<int>> VerifyGarage(VerifyGarageDto verifyGarageDto);
        Task<ServiceResponse<int>> DeleteGarage(int garageSpotId);
    }
}
