using AutoHub.Data;
using AutoHub.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AutoHub.Services
{
    public class GarageSpotService : BaseService, IGarageSpotService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public GarageSpotService(AppDbContext context,IMapper mapper,IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpots()
        {

            var garagaSpots = await _context.GarageSpots.ToListAsync();

            var response = new ServiceResponse<List<GarageSpotDto>>
            {
                Value = _mapper.Map<List<GarageSpotDto>>(garagaSpots)
            };

            return response;
        }

        public async Task<ServiceResponse<string>> CreateGarageSpot(GarageSpotDto newSpot)
        {
            var response = new ServiceResponse<string>();

            var garageSpot = _mapper.Map<GarageSpot>(newSpot);
            var ownerId = GetUserId();

            // Fetch the existing user if needed
            var existingUser = await _context.Users.FindAsync(ownerId);
            if (existingUser == null)
            {
                response.Success = false;
                response.Message = "User does not exist.";
                return response;
            }

            garageSpot.Owner = existingUser; // Set the Owner directly
            garageSpot.OwnerId = ownerId; // Ensure OwnerId is set correctly

            _context.GarageSpots.Add(garageSpot);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Garage spot created successfully.";
            response.Value = garageSpot.Id.ToString();

            return response;
        }

        public async Task<ServiceResponse<List<GarageSpot>>> GetOwnerGarageSpots()
        {
            var ownerId = GetUserId(); 

            var response = new ServiceResponse<List<GarageSpot>>
            {
                Value = await _context.GarageSpots
                    .Where(g => g.OwnerId == ownerId)
                    .ToListAsync()
            };

            return response;
        }
        public async Task<ServiceResponse<bool>> DeleteGarageSpot(int spotId)
        {
            var response = new ServiceResponse<bool>();
            var garageSpot = await _context.GarageSpots.FindAsync(spotId);

            if (garageSpot == null)
            {
                response.Success = false;
                response.Message = "Garage spot not found.";
                return response;
            }

            if (garageSpot.OwnerId != GetUserId())
            {
                response.Success = false;
                response.Message = "You are not authorized to delete this garage spot.";
                return response;
            }

            _context.GarageSpots.Remove(garageSpot);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Garage spot deleted successfully.";
            response.Value = true; 

            return response;
        }

    }
}
