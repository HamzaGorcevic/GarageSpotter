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
            private readonly IAuthRepository _authRepository;
            public ElectricChargerService(IMapper mapper,IHttpContextAccessor httpContextAccessor, IAuthRepository authRepository,AppDbContext dbContext,IAzureBlobService azureBlobService,CacheService cacheService)
                : base(httpContextAccessor, dbContext, cacheService)
            {
                _authRepository = authRepository;
                userId = GetUserId();
                _azureBlobService = azureBlobService;
                _mapper = mapper;

            }

            public async Task<ServiceResponse<string>> CreateElectricCharger([FromForm] IFormFile verificationDocument, [FromForm] CreateElectricCharagerDto electricChargerDto)
            {
                var response = new ServiceResponse<string>();
                string verificationDocumentPath = "";
                if (verificationDocument != null)
                {
                    verificationDocumentPath = await _azureBlobService.UploadFileAsync(verificationDocument, "charger-verifications");
                }
                try
                {
                    var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == GetUserId());
                    string newToken = "";
                    if (user!.Role != Models.Enums.UserRole.Owner)
                    {
                        newToken = _authRepository.CreateToken(user.Name, Models.Enums.UserRole.Owner, userId,user.Email,user.PasswordVerification);
                        user!.Role = Models.Enums.UserRole.Owner;

                    }
                   var newCharger = _mapper.Map<ElectricCharger>(electricChargerDto);

                newCharger.Owner = user;
                newCharger.OwnerId = user.Id;
                newCharger.VerificationDocument = verificationDocumentPath;
                    _dbContext.ElectricChargers.Add(newCharger);
                    await _dbContext.SaveChangesAsync();
                    response.Value = newToken;
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
            catch (Exception ex)
            {
                response.Success = false;
                response.Value = [];
                response.Message = ex.Message;
                return response;
            }
        }


        public async Task<ServiceResponse<List<ElectricCharger>>> GetElectricChargersByCountry(string countryName)
            {
                var response = new ServiceResponse<List<ElectricCharger>>();

                try
                {
                    var chargers = await _dbContext.ElectricChargers.Where(ec => ec.CountryName == countryName && ec.IsVerified).ToListAsync();
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
            public async Task<ServiceResponse<int>> UpdateElectricCharger([FromForm] CreateElectricCharagerDto electricChargerDto, int electricChargerId)
            {
                var response = new ServiceResponse<int>();

                try
                {
                    var charger = await _dbContext.ElectricChargers.FindAsync(electricChargerId);
                    if (charger == null)
                    {
                        response.Success = false;   
                        response.Message = "Electric charger not found.";   
                        return response;
                    }

                    _mapper.Map(electricChargerDto,charger);
                    _dbContext.Entry(charger).State = EntityState.Modified;

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

        public async Task<ServiceResponse<bool>> DeleteElectricCharger(int ecId)
        {
            var response = new ServiceResponse<bool>();
            var electricCharger = await _dbContext.ElectricChargers.FindAsync(ecId);

            if (electricCharger == null)
            {
                response.Success = false;
                response.Message = "EC spot not found.";
                return response;
            }

            if (electricCharger.OwnerId != GetUserId())
            {
                response.Success = false;
                response.Message = "You are not authorized to delete this garage spot.";
                return response;
            }

            _dbContext.ElectricChargers.Remove(electricCharger);
            await _dbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "EC spot deleted successfully.";
            response.Value = true;

            return response;
        }


    }

    }
