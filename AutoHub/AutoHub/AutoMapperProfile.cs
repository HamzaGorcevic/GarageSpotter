using AutoHub.Models;
using AutoMapper;

namespace AutoHub
{
    public class AutoMapperProfile:Profile
    {
        public AutoMapperProfile() {
            CreateMap<RegisterDto, User>();
            CreateMap<User,RegisterDto>();
            CreateMap<GarageSpot, GarageSpotDto>();
            CreateMap<GarageSpotDto, GarageSpot>();

        
        }

    }
}
