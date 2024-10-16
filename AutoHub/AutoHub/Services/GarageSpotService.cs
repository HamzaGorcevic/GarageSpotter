using AutoHub.Data;
using AutoHub.Dtos;
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

            var garagaSpots = await _context.GarageSpots.Include(g=>g.TotalSpots).ToListAsync();

            var response = new ServiceResponse<List<GarageSpotDto>>
            {
                Value = _mapper.Map<List<GarageSpotDto>>(garagaSpots)
            };

            return response;
        }
        public async Task<ServiceResponse<GarageSpotDto>> GetGarageSpot(int garageSpotId)
        {
            var response = new ServiceResponse<GarageSpotDto>();
            var garapgeSpot = await _context.GarageSpots.Include(g => g.TotalSpots).FirstOrDefaultAsync(g=>g.Id==garageSpotId);

            if (garapgeSpot is not null)
            {

                var garageSpotDto = _mapper.Map<GarageSpotDto>(garapgeSpot);
                response.Value = garageSpotDto;
                response.Success = true;
                response.Message = "Succesfully found garage";
                return response;
            }
            response.Success = false;
            response.Message = "Garage not found";
            response.Value = null;
            return response;
            
        }
        public async Task<ServiceResponse<int>> CreateGarageSpot(CreateGarageSpotDto newSpot)
        {
            var response = new ServiceResponse<int>();

            var garageSpot = new GarageSpot
            {
                OwnerId = GetUserId(),
                LocationName = newSpot.LocationName,
                IsAvailable = newSpot.IsAvailable,
                Latitude = newSpot.Latitude,
                Longitude = newSpot.Longitude,
                VerificationDocument = newSpot.VerificationDocument,
                Price = newSpot.Price,
                GarageImages = newSpot.GarageImages
            };

            // Save garage spot first to generate GarageSpotId
            _context.GarageSpots.Add(garageSpot);
            await _context.SaveChangesAsync();

            // Automatically create the specified number of SingleSpots
            for (int i = 0; i < newSpot.NumberOfSpots; i++)
            {
                var singleSpot = new SingleSpot
                {
                    IsAvailable = true, // By default, each SingleSpot is available
                    GarageSpotId = garageSpot.Id
                };

                _context.SingleSpots.Add(singleSpot);
            }

            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = $"Garage spot with {newSpot.NumberOfSpots} spots created successfully.";
            response.Value = garageSpot.Id;
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
