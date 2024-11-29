using AutoHub.Models;
using AutoHub.Dtos;
using Microsoft.AspNetCore.Mvc;
namespace AutoHub.Services
{
    public interface IElectricChargerService
    {
        Task<ServiceResponse<List<ElectricCharger>>> GetElectricChargersByCountry(string countryName);
        Task<ServiceResponse<List<ElectricCharger>>> GetOwnerElectricChargers();
        Task<ServiceResponse<CreateElectricCharagerDto>> GetElectricChargerById(int id);
        Task<ServiceResponse<string>> CreateElectricCharger([FromForm] IFormFile verificationDocument,[FromForm] CreateElectricCharagerDto electricCharger);
        Task<ServiceResponse<int>> UpdateElectricCharger([FromForm] IFormFile verificationDocument, [FromForm] CreateElectricCharagerDto electricCharger,int electricChargerId);
        Task<ServiceResponse<bool>> DeleteElectricCharger(int ecId);
    }
}
