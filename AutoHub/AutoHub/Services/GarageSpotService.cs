using AutoHub.Data;
using AutoHub.Dtos;
using AutoHub.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoHub.Services
{
    public class GarageSpotService : BaseService, IGarageSpotService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IAzureBlobService _azureBlobService;
        public GarageSpotService(AppDbContext dbContext,IMapper mapper,IAzureBlobService azureBlobService,IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor,dbContext)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _azureBlobService = azureBlobService;
        }
        public async Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpotsByCountry(string country)
        {
            await ClearReservations();

            var garagaSpots = await _dbContext.GarageSpots.Include(g => g.TotalSpots).Where(g=>g.CountryName==country && g.IsVerified).ToListAsync();

            var response = new ServiceResponse<List<GarageSpotDto>>
            {
                Value = _mapper.Map<List<GarageSpotDto>>(garagaSpots)
            };

            return response;
        }

        public async Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpots()
        {

            var garagaSpots = await _dbContext.GarageSpots.Include(g=>g.TotalSpots).ToListAsync();

            var response = new ServiceResponse<List<GarageSpotDto>>
            {
                Value = _mapper.Map<List<GarageSpotDto>>(garagaSpots)
            };

            return response;
        }
        public async Task<ServiceResponse<GarageSpotDto>> GetGarageSpot(int garageSpotId)
        {
            var response = new ServiceResponse<GarageSpotDto>();
            var garapgeSpot = await _dbContext.GarageSpots.Include(g => g.TotalSpots).FirstOrDefaultAsync(g=>g.Id==garageSpotId);

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
        public async Task<ServiceResponse<int>> CreateGarageSpot([FromForm] IFormFile verificationDocument, [FromForm] List<IFormFile> garageImages, [FromForm] CreateGarageSpotDto newSpot)
        {
            var response = new ServiceResponse<int>();
            var userId = GetUserId(); 

            if (verificationDocument != null)
            {
                newSpot.VerificationDocument = await _azureBlobService.UploadFileAsync(verificationDocument, "garage-verifications");
            }

            if (garageImages != null && garageImages.Count > 0)
            {
                newSpot.GarageImages = await _azureBlobService.UploadMultipleFilesAsync(garageImages, "garage-images");
            }

            // when user create garage i should make him owner instead of user 
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            user!.Role = Models.Enums.UserRole.Owner;
            var garageSpot = _mapper.Map<GarageSpot>(newSpot);
            garageSpot.OwnerId = userId;
            garageSpot.Owner = user;
            _dbContext.GarageSpots.Add(garageSpot);
            await _dbContext.SaveChangesAsync();

            for (int i = 0; i < newSpot.NumberOfSpots; i++)
            {
                var singleSpot = new SingleSpot
                {
                    IsAvailable = true,
                    GarageSpotId = garageSpot.Id
                };

                _dbContext.SingleSpots.Add(singleSpot);
            }

            await _dbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = $"Garage spot with {newSpot.NumberOfSpots} spots created successfully.";
            response.Value = garageSpot.Id;
            return response;
        }


        public async Task<ServiceResponse<List<GarageSpotDto>>> GetOwnerGarageSpots()
        {
            var response = new ServiceResponse<List<GarageSpotDto>>();
            var ownerId = GetUserId();

            var garagespots = await _dbContext.GarageSpots
                    .Where(g => g.OwnerId == ownerId)
                    .ToListAsync();
            
            if(garagespots.Count == 0)
            {
                response.Success = false;
                response.Message = "This owner doesnt have garages anymore";
                response.Value = null;
                return response;

            }
            var garagespotsDto = _mapper.Map < List<GarageSpotDto>>(garagespots);

           
            response.Success = true;
            response.Message = "Succesfully found garages";
            response.Value = garagespotsDto;

            return response;
        }
        public async Task<ServiceResponse<int>> UpdateGarageSpot([FromForm] IFormFile verificationDocument, [FromForm] List<IFormFile> garageImages, [FromForm] CreateGarageSpotDto updatedSpot,int garageSpotId)
        {
            var response = new ServiceResponse<int>();

            var garagespot = await _dbContext.GarageSpots.FirstOrDefaultAsync(g => g.Id == garageSpotId);


            if (garagespot == null)
            {
                response.Success = false;
                response.Message = "Not found";
                response.Value = 0;
                return response;
            }
            if (verificationDocument != null)
            {
                garagespot.VerificationDocument = await _azureBlobService.UploadFileAsync(verificationDocument, "garage-verifications");
            }

            if (garageImages != null && garageImages.Count > 0)
            {
                garagespot.GarageImages = await _azureBlobService.UploadMultipleFilesAsync(garageImages, "garage-images");
            }
            garagespot.Longitude = updatedSpot.Longitude;
            garagespot.Latitude = updatedSpot.Latitude;
            garagespot.LocationName = updatedSpot.LocationName;
            garagespot.Price = updatedSpot.Price;
            garagespot.VerificationDocument = updatedSpot.CountryName;
            garagespot.CountryName = updatedSpot.CountryName;

            await _dbContext.SaveChangesAsync();
            response.Success = true;
            response.Message = "Succesfully updated garage";
            response.Value = garagespot.Id;
            return response;
        }
        public async Task<ServiceResponse<bool>> DeleteGarageSpot(int spotId)
        {
            var response = new ServiceResponse<bool>();
            var garageSpot = await _dbContext.GarageSpots.FindAsync(spotId);

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

            _dbContext.GarageSpots.Remove(garageSpot);
            await _dbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "Garage spot deleted successfully.";
            response.Value = true; 

            return response;
        }


    }
}
