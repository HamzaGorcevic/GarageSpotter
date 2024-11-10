    using AutoHub.Data;
    using AutoHub.Dtos;
    using AutoHub.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

    namespace AutoHub.Services
    {
        public class ElectricChargerService : BaseService, IElectricChargerService
        {
            private readonly int userId;
            private readonly IAzureBlobService _azureBlobService;
        private readonly IMapper _mapper;
            public ElectricChargerService(IMapper mapper,IHttpContextAccessor httpContextAccessor, AppDbContext dbContext,IAzureBlobService azureBlobService)
                : base(httpContextAccessor, dbContext)
            {
                userId = GetUserId();
                _azureBlobService = azureBlobService;
                _mapper = mapper;

            }

            public async Task<ServiceResponse<int>> CreateElectricCharger([FromForm] IFormFile verificationDocument, [FromForm] CreateElectricCharagerDto electricChargerDto)
            {
                var response = new ServiceResponse<int>();
                string verificationDocumentPath = "";
                if (verificationDocument != null)
                {
                    verificationDocumentPath = await _azureBlobService.UploadFileAsync(verificationDocument, "charger-verifications");
                }
                try
                {
                    var newCharger = new ElectricCharger
                    {
                        Name = electricChargerDto.Name,
                        CountryName = electricChargerDto.CountryName,
                        Latitude = electricChargerDto.Latitude,
                        Longitude = electricChargerDto.Longitude,
                        IsVerified = false,
                        Price = electricChargerDto.Price,
                        VerificationDocument = verificationDocumentPath,
                        Description = electricChargerDto.Description,
                        AvailbleSpots = electricChargerDto.AvailbleSpots
                    };

                    _dbContext.ElectricChargers.Add(newCharger);
                    await _dbContext.SaveChangesAsync();

                    response.Value = newCharger.Id;
                    response.Success = true;
                    response.Message = "Electric charger created successfully.";
                }
                catch (Exception ex)
                {
                    response.Success = false;
                    response.Message = $"Error creating electric charger: {ex.Message}";
                }

                return response;
            }
        public async Task<ServiceResponse<CreateElectricCharagerDto>> GetElectricChargerById(int id)
        {
            var response = new ServiceResponse<CreateElectricCharagerDto>();
            var charger = await _dbContext.ElectricChargers.FindAsync(id);
            if (charger == null)
            {
                response.Success = false;
                response.Message = "Electric charger not found.";
                return response;
            }
            var chargerDto = _mapper.Map<CreateElectricCharagerDto>(charger);
            response.Success = true;
            response.Value = chargerDto;
            return response;
        }




            public async Task<ServiceResponse<List<ElectricCharger>>> GetElectricChargersByCountry(string countryName)
            {
                var response = new ServiceResponse<List<ElectricCharger>>();

                try
                {
                    var chargers = await _dbContext.ElectricChargers.Where(ec => ec.CountryName == countryName).ToListAsync();
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
            public async Task<ServiceResponse<int>> UpdateElectricCharger([FromForm] IFormFile verificationDocument,[FromForm] CreateElectricCharagerDto electricChargerDto, int electricChargerId)
            {
                var response = new ServiceResponse<int>();
                string verificationDocumentPath = "";

                try
                {
                    var charger = await _dbContext.ElectricChargers.FindAsync(electricChargerId);
                    if (charger == null)
                    {
                        response.Success = false;
                        response.Message = "Electric charger not found.";
                        return response;
                    }
                     var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                    user!.Role = Models.Enums.UserRole.Owner;
                    charger.Owner = user;
                    charger.OwnerId = GetUserId();
                    charger.IsVerified = false;
                    charger.Name = electricChargerDto.Name;
                    charger.CountryName = electricChargerDto.CountryName;
                    charger.Latitude = electricChargerDto.Latitude;
                    charger.Longitude = electricChargerDto.Longitude;
                    charger.Price = electricChargerDto.Price;
                    charger.Description = electricChargerDto.Description;
                    charger.AvailbleSpots = electricChargerDto.AvailbleSpots;
              


                    if (verificationDocument != null)
                    {
                        verificationDocumentPath = await _azureBlobService.UploadFileAsync(verificationDocument, "charger-verifications");
                        charger.VerificationDocument = verificationDocumentPath;
                    }

                    await _dbContext.SaveChangesAsync();

                    response.Value = charger.Id;
                    response.Success = true;
                    response.Message = "Electric charger updated successfully.";
                }
                catch (Exception ex)
                {
                    response.Success = false;
                    response.Message = $"Error updating electric charger: {ex.Message}";
                }

                return response;
            }

        public async Task<ServiceResponse<List<ElectricCharger>>> GetOwnerElectricChargers()
        {
            var response = new ServiceResponse<List<ElectricCharger>>();
            try
            {
                var eChargers = await _dbContext.ElectricChargers.Where(ec => ec.OwnerId == GetUserId()).ToListAsync();
                response.Success = true;
                response.Value = eChargers;
                response.Message = "Electric chargers !";
                return response;
            }
            catch (Exception ex) { 
                response.Success = false;
                response.Value = [];
                response.Message = ex.Message;
                return response;
            }
        }
    }

    }
