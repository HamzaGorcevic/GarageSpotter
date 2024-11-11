using AutoHub.Dtos;
using AutoHub.Models;

namespace AutoHub.Services
{
    public interface IAdminService
    {
        Task<ServiceResponse<List<GarageSpotDto>>> GetGarages();
        Task<ServiceResponse<int>> VerifyGarage(VerifyGarageDto verifyGarageDto);
        Task<ServiceResponse<int>> DeleteGarage(int garageSpotId);
        Task<ServiceResponse<int>> DeleteElectricCharger(int chargerId);
        Task<ServiceResponse<int>> VerifyElectricCharger(VerifyGarageDto verifyElectricCharger);
        Task<ServiceResponse<List<ElectricCharger>>> GetElectricChargers();
        Task<ServiceResponse<int>> DeleteUser(int userId);
        Task<ServiceResponse<List<UserDto>>> GetUsers();


    }
}
