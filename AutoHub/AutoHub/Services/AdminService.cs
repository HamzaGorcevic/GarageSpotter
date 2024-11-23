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
            var garageSpot = await _dbContext.GarageSpots.FindAsync(verifyGarageDto.Id);

            if (garageSpot == null)
            {
                response.Message = "Garage spot not found";
                response.Success = false;
                return response;
            }

            garageSpot.IsVerified = true;
            _dbContext.GarageSpots.Update(garageSpot);
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
        public async Task<ServiceResponse<int>> DeleteElectricCharger(int chargerId)
        {
            var response = new ServiceResponse<int>();

            try
            {
                var charger = await _dbContext.ElectricChargers.FindAsync(chargerId);
                if (charger == null)
                {
                    response.Success = false;
                    response.Message = "Electric charger not found.";
                    return response;
                }

                _dbContext.ElectricChargers.Remove(charger);
                await _dbContext.SaveChangesAsync();

                response.Value = chargerId;
                response.Success = true;
                response.Message = "Electric charger deleted successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error deleting electric charger: {ex.Message}";
            }

            return response;
        }
        public async Task<ServiceResponse<int>> VerifyElectricCharger(VerifyGarageDto verifyElectricCharger)
        {
            var response = new ServiceResponse<int>();

            try
            {
                var charger = await _dbContext.ElectricChargers.FindAsync(verifyElectricCharger.Id);
                if (charger == null)
                {
                    response.Success = false;
                    response.Message = "Electric charger not found.";
                    return response;
                }

                charger.IsVerified = true;
                await _dbContext.SaveChangesAsync();

                response.Value = charger.Id;
                response.Success = true;
                response.Message = "Electric charger verified successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error verifying electric charger: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<List<ElectricCharger>>> GetElectricChargers()
        {
            var response = new ServiceResponse<List<ElectricCharger>>();

            try
            {
                var chargers = await _dbContext.ElectricChargers
                    .Where(ec => !ec.IsVerified)
                    .ToListAsync();

                response.Value = chargers;
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred while fetching chargers: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<int>> DeleteUser(int userId)
        {
            var response = new ServiceResponse<int>();
            var userToDelete = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if(userToDelete == null)
            {
                response.Success = false;
                response.Message = "User doesnt exist!";
                response.Value = userId;
                return response;
            }
            
            _dbContext.Users.Remove(userToDelete);
            await _dbContext.SaveChangesAsync();
            response.Value = userId;
            response.Success = true;
            response.Message = "User deleted succesfully!";
            return response;
        }

        public async Task<ServiceResponse<List<UserDto>>> GetUsers()
        {
            var response = new ServiceResponse<List<UserDto>>();
            var users = await _dbContext.Users.ToListAsync();
            if(users == null)
            {
                response.Value = new List<UserDto>();
                response.Success = false;
                response.Message = "No user found";

                return response;
            }
            var userDtos = _mapper.Map<List<UserDto>>(users);
            response.Value = userDtos;
            response.Success = true;
            response.Message = "Users found";
            return response;
        }
    }
}
