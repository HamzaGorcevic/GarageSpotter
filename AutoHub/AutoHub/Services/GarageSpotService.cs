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
        private readonly IAuthRepository _authRepository;
        public GarageSpotService(AppDbContext dbContext,IAuthRepository authRepository,IMapper mapper,IAzureBlobService azureBlobService,IHttpContextAccessor httpContextAccessor,CacheService cacheService) : base(httpContextAccessor,dbContext,cacheService)
        {
            _authRepository = authRepository;
            _dbContext = dbContext;
            _mapper = mapper;
            _azureBlobService = azureBlobService;
        }
        public async Task<ServiceResponse<List<GarageSpotDto>>> GetGarageSpotsByCountry(string country)
        {
            await ClearReservationsIfNeeded();

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
        public async Task<ServiceResponse<List<GarageSpotDto>>> GetOwnerGarageSpots()
        {
            var response = new ServiceResponse<List<GarageSpotDto>>();
            var ownerId = GetUserId();

            var garagespots = await _dbContext.GarageSpots
                    .Where(g => g.OwnerId == ownerId).Include(g=>g.TotalSpots)
                    .ToListAsync();

            if (garagespots.Count == 0)
            {
                response.Success = false;
                response.Message = "This owner doesnt have garages anymore";
                response.Value = null;
                return response;

            }
            var garagespotsDto = _mapper.Map<List<GarageSpotDto>>(garagespots);


            response.Success = true;
            response.Message = "Succesfully found garages";
            response.Value = garagespotsDto;

            return response;
        }
        public async Task<ServiceResponse<List<GarageSpotDto>>> GetFavorites()
        {
            var response = new ServiceResponse<List<GarageSpotDto>>();
            var userId = GetUserId(); 

            var user = await _dbContext.Users
                .Include(u => u.Favorites)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Favorites == null || user.Favorites.Count == 0)
            {
                response.Success = false;
                response.Message = "No favorite garage spots found for this user.";
                response.Value = null;
                return response;
            }

            var favoriteSpotsDto = _mapper.Map<List<GarageSpotDto>>(user.Favorites);

            response.Success = true;
            response.Message = "Successfully retrieved favorite garage spots.";
            response.Value = favoriteSpotsDto;

            return response;
        }
        public async Task<ServiceResponse<int>> RemoveFromFavorites(int garageSpotId)
        {
            var response = new ServiceResponse<int>();

            try
            {
                var userId = GetUserId();  

                var user = await _dbContext.Users
                    .Include(u => u.Favorites)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                var garageSpot = await _dbContext.GarageSpots
                    .FirstOrDefaultAsync(g => g.Id == garageSpotId);

                if (user == null)
                {
                    response.Success = false;
                    response.Message = "User not found.";
                    return response;
                }

                if (garageSpot == null)
                {
                    response.Success = false;
                    response.Message = "Garage spot not found.";
                    return response;
                }

                var favoriteSpot = user.Favorites?.FirstOrDefault(g => g.Id == garageSpotId);

                if (favoriteSpot == null)
                {
                    response.Success = false;
                    response.Message = "Garage spot is not in your favorites.";
                    return response;
                }

                user.Favorites.Remove(favoriteSpot);

                await _dbContext.SaveChangesAsync();  

                response.Success = true;
                response.Message = "Garage spot removed from favorites successfully.";
                response.Value = garageSpotId;  
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<string>> AddToFavorites(int garageSpotId)
        {
            var response = new ServiceResponse<string>();
            var userId = GetUserId(); 

            var user = await _dbContext.Users
                .Include(u => u.Favorites)  
                .FirstOrDefaultAsync(u => u.Id == userId);

            var garageSpot = await _dbContext.GarageSpots
                .FirstOrDefaultAsync(g => g.Id == garageSpotId);

            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found.";
                return response;
            }

            if (garageSpot == null)
            {
                response.Success = false;
                response.Message = "Garage spot not found.";
                return response;
            }

            if (user.Favorites != null && user.Favorites.Any(g => g.Id == garageSpotId))
            {
                response.Success = false;
                response.Message = "Garage spot is already in favorites.";
                return response;
            }

            user.Favorites ??= new List<GarageSpot>();
            user.Favorites.Add(garageSpot);

            await _dbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "Garage spot added to favorites successfully.";
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
        public async Task<ServiceResponse<string>> CreateGarageSpot( IFormFile verificationDocument, List<IFormFile> garageImages,  CreateGarageSpotDto newSpot)
        {
            var response = new ServiceResponse<string>();
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
            string newToken = "";
            if (user!.Role != Models.Enums.UserRole.Owner)
            {
                newToken = _authRepository.CreateToken(user.Name, Models.Enums.UserRole.Owner, userId, user.Email, user.PasswordVerification);
                user!.Role = Models.Enums.UserRole.Owner;

            }
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
            response.Value = newToken;
            return response;
        }



        public async Task<ServiceResponse<int>> UpdateGarageSpot(
            [FromForm] List<IFormFile> garageImages,
            [FromForm] List<string> existingImages,
            [FromForm] CreateGarageSpotDto updatedSpot,
    int garageSpotId)
        {
            var response = new ServiceResponse<int>();

            var garagespot = await _dbContext.GarageSpots.FirstOrDefaultAsync(g => g.Id == garageSpotId);
            if (garagespot == null)
            {
                response.Success = false;
                response.Message = "Garage spot not found";
                return response;
            }

            try
            {
                var uploadedImages = new List<string>();
                if (garageImages != null && garageImages.Any())
                {
                    uploadedImages = await _azureBlobService.UploadMultipleFilesAsync(garageImages, "garage-images");
                }

                garagespot.GarageImages = (existingImages ?? new List<string>())
                    .Concat(uploadedImages)
                    .ToList();

                // Update other properties
                garagespot.Longitude = updatedSpot.Longitude;
                garagespot.Latitude = updatedSpot.Latitude;
                garagespot.LocationName = updatedSpot.LocationName;
                garagespot.Price = updatedSpot.Price;
                garagespot.VerificationDocument = updatedSpot.VerificationDocument;
                garagespot.CountryName = updatedSpot.CountryName;
                garagespot.IsVerified = false;
                await _dbContext.SaveChangesAsync();

                response.Success = true;
                response.Message = "Garage spot updated successfully";
                response.Value = garagespot.Id;
            }
            catch (Exception ex)
            {
                // Handle exceptions
                response.Success = false;
                response.Message = $"Error updating garage spot: {ex.Message}";
            }

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
            Console.WriteLine(GetUserId());
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
