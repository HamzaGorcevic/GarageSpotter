using AutoHub.Dtos;
using AutoHub.Services;
using HotChocolate;
using HotChocolate.Types;
using AutoHub.Models;
using HotChocolate.Authorization;
using AutoHub.Helpers;

namespace AutoHub.GraphQl.Mutations
{
    public class Mutation
    {
        //[Authorize(Roles = new[] { "Owner"})]
        public async Task<ServiceResponse<string>> CreateGarage(
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

            return result;
        }

        //[Authorize(Roles = new[] { "Owner"})]
        public async Task<ServiceResponse<int>> UpdateGarage(
            [Service] IGarageSpotService service,   
            UpdateGarageInput input)
        {

            {
                var garageFiles = await input.GarageImages.ToIFormFilesAsync();


                var result = await service.UpdateGarageSpot(
                    garageFiles,
                    input?.ExistingImages,
                    new CreateGarageSpotDto
                    {
                        Price = input.Price,
                        CountryName = input.CountryName,
                        Latitude = input.Latitude,
                        Longitude = input.Longitude,
                        LocationName = input.LocationName
                    },
                    input.Id);

                return result;
            }
        }


        //[Authorize(Roles = new[] {"Owner","Admin"})]
        public async Task<ServiceResponse<bool>> DeleteGarage(
            [Service] IGarageSpotService service,
            DeleteGarageSpotInput input)
        {
            var result = await service.DeleteGarageSpot(input.SpotId);
            return result;
        }
    }

    // Input types remain the same
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
        public int Id { get; set; }
        public List<IFile>? GarageImages { get; set; }
        public List<string>? ExistingImages { get; set; }
        public int Price { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public int NumberOfSpots { get; set; }
        //public IFile? VerificationDocument { get; set; }


    }
    public class DeleteGarageSpotInput
    {
        public int SpotId { get; set; }
    }   
}