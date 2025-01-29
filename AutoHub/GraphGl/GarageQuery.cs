using AutoHub.Dtos;
using AutoHub.Services;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;

namespace AutoHub.GraphQL.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class GarageQuery
    {
        [Authorize(Roles = new[] { "Owner" })]
        public async Task<List<GarageSpotDto>> GetOwnerGarages(
            [Service] IGarageSpotService garageSpotService)
        {
            var result = await garageSpotService.GetOwnerGarageSpots();
            return result.Value ?? new List<GarageSpotDto>();
        }

        [UseProjection]
        [Authorize(Roles = new[] { "User", "Owner" })]
        public async Task<List<GarageSpotDto>> GetGarageSpots(
            [Service] IGarageSpotService garageSpotService)
        {
            var result = await garageSpotService.GetGarageSpots();
            return result.Value ?? new List<GarageSpotDto>();
        }
    }
}