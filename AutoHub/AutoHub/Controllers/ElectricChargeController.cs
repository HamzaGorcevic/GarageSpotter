using AutoHub.Dtos;
using AutoHub.Models;
using AutoHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ElectricChargerController : ControllerBase
    {
        private readonly IElectricChargerService _electricChargerService;

        public ElectricChargerController(IElectricChargerService electricChargerService)
        {
            _electricChargerService = electricChargerService;
        }

        [HttpGet("getOwnerElectricChargers")]
        [Authorize(Roles = "Owner")]
        public async Task<ActionResult<ServiceResponse<List<ElectricCharger>>>> GetOwnerElectricChargers()
        {
            var response = await _electricChargerService.GetOwnerElectricChargers();
            return response;
        }

        [HttpGet("getElectricChargersByCountry")]
        [Authorize(Roles = "User,Owner")]
        public async Task<ActionResult<ServiceResponse<List<ElectricCharger>>>> GetElectricChargersByCountry(string countryName)
        {
            var response = await _electricChargerService.GetElectricChargersByCountry(countryName);
            return response;
        }

        [HttpGet("getElectricChargerById")]
        [Authorize(Roles = "User,Owner")]
        public async Task<ServiceResponse<CreateElectricCharagerDto>> GetElectricChargerById(int id)
        {
            var response = await _electricChargerService.GetElectricChargerById(id);
            return response;
        }

        [HttpPost("createElectricCharger")]
        [Authorize(Roles = "Owner,User")]
        public async Task<ServiceResponse<string>> CreateElectricCharger([FromForm] IFormFile verificationDocument, [FromForm] CreateElectricCharagerDto electricChargerDto)
        {   
            return await _electricChargerService.CreateElectricCharger(verificationDocument, electricChargerDto);
        }

        [HttpPut("updateElectricCharger")]
        [Authorize(Roles = "Owner")]
        public async Task<ServiceResponse<int>> UpdateElectricCharger([FromForm] CreateElectricCharagerDto electricCharger, int electricChargerId)
        {
            return await _electricChargerService.UpdateElectricCharger( electricCharger, electricChargerId);
        }

        [HttpDelete("deleteElectricCharger")]
        [Authorize(Roles = "Owner")]

        public async Task<ServiceResponse<bool>> OwnerDeleteGarageSpot(int chargerId)
        {
            return await _electricChargerService.DeleteElectricCharger(chargerId);
        }






    }
}
