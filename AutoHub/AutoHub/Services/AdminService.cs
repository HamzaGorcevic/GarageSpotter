using AutoHub.Data;
using AutoHub.Dtos;
using AutoHub.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AutoHub.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public AdminService(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<GarageSpotDto>>> GetGarages()
        {
            var response = new ServiceResponse<List<GarageSpotDto>>();
            var garages = await _dbContext.GarageSpots.Where(g => g.IsVerified == false).ToListAsync();

            if (garages.Count == 0)
            {
                response.Message = "No garages found";
                response.Success = false;
                response.Value = new List<GarageSpotDto>(); 
                return response;
            }

            var garagesDto = _mapper.Map<List<GarageSpotDto>>(garages);
            response.Message = "Garages successfully found!";
            response.Success = true;
            response.Value = garagesDto;
            return response;
        }

        public async Task<ServiceResponse<int>> VerifyGarage(VerifyGarageDto verifyGarageDto)
        {
            var response = new ServiceResponse<int>();
            Console.WriteLine($"ovdeje {verifyGarageDto.Id.ToString()}");
            var garageSpot = await _dbContext.GarageSpots.FindAsync(verifyGarageDto.Id);

            if (garageSpot == null)
            {
                response.Message = "Garage spot not found";
                response.Success = false;
                return response;
            }

            garageSpot.IsVerified = true; 
            await _dbContext.SaveChangesAsync();

            response.Message = "Garage successfully verified!";
            response.Success = true;
            response.Value = verifyGarageDto.Id;
            return response;
        }

        public async Task<ServiceResponse<int>> DeleteGarage(int garageSpotId)
        {
            var response = new ServiceResponse<int>();
            var garageSpot = await _dbContext.GarageSpots.FindAsync(garageSpotId);

            if (garageSpot == null)
            {
                response.Message = "Garage spot not found";
                response.Success = false;
                return response;
            }

            _dbContext.GarageSpots.Remove(garageSpot);
            await _dbContext.SaveChangesAsync();

            response.Message = "Garage successfully deleted!";
            response.Success = true;
            response.Value = garageSpotId; 
            return response;
        }
    }
}
