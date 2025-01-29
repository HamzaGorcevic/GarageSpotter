using AutoHub.Dtos;
using AutoHub.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;

namespace AutoHub.GraphQL.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class GarageMutation
    {
        [Authorize(Roles = new[] { "Owner", "User" })]
        public async Task<GarageSpotDto> CreateGarage(
            [Service] IGarageSpotService service,
            CreateGarageInput input)
        {
            var verificationFile = await input.VerificationDocument.ToIFormFileAsync();
            var garageFiles = await input.GarageImages.ToIFormFilesAsync();

            var result = await service.CreateGarageSpot(
                verificationFile,
                garageFiles,
                new CreateGarageSpotDto
                {
                    NumberOfSpots = input.NumberOfSpots,
                    Price = input.Price,
                    CountryName = input.CountryName,
                    Latitude = input.Latitude,
                    Longitude = input.Longitude,
                    LocationName = input.LocationName
                });

            return result.Value; // Adjust based on your ServiceResponse structure
        }

        [Authorize(Roles = new[] { "Owner", "User" })]
        public async Task<GarageSpotDto> UpdateGarage(
            [Service] IGarageSpotService service,
            UpdateGarageInput input)
        {
            var garageFiles = await input.GarageImages.ToIFormFilesAsync();

            var result = await service.UpdateGarageSpot(
                garageFiles,
                input.ExistingImages,
                new CreateGarageSpotDto
                {
                    Price = input.Price,
                    CountryName = input.CountryName,
                    Latitude = input.Latitude,
                    Longitude = input.Longitude,
                    LocationName = input.LocationName
                },
                input.GarageSpotId);

            return result.Value; // Adjust based on your ServiceResponse structure
        }
    }

    public class CreateGarageInput
    {
        public IFile? VerificationDocument { get; set; }
        public List<IFile>? GarageImages { get; set; }
        public int NumberOfSpots { get; set; }
        public int Price { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string LocationName { get; set; } = string.Empty;
    }

    public class UpdateGarageInput
    {
        public int GarageSpotId { get; set; }
        public List<IFile>? GarageImages { get; set; }
        public List<string>? ExistingImages { get; set; }
        public int Price { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string LocationName { get; set; } = string.Empty;
    }
}