using AutoHub.Models;
using AutoHub.Services;

public class Query
{
    public async Task<List<GarageSpotDto>> GetOwnerGarages(
        [Service] IGarageSpotService garageSpotService)
    {
        var result = await garageSpotService.GetOwnerGarageSpots();
        return result.Value;
    }

    [UseProjection]
    public async Task<List<GarageSpotDto>> GetGarageSpots(
        [Service] IGarageSpotService garageSpotService)
    {
        var result = await garageSpotService.GetGarageSpots();
        return result.Value;
    }
}
