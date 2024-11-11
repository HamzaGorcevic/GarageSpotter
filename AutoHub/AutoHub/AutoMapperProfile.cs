using AutoHub.Dtos;
using AutoHub.Models;
using AutoMapper;

namespace AutoHub
{
    public class AutoMapperProfile:Profile
    {
        public AutoMapperProfile() {
            CreateMap<RegisterDto, User>();
            CreateMap<User,RegisterDto>();
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<GarageSpot, GarageSpotDto>();
            CreateMap<GarageSpotDto, GarageSpot>();
            CreateMap<CreateGarageSpotDto,GarageSpot>();
            CreateMap<GarageSpot, CreateGarageSpotDto>();
            CreateMap<ReserveDto, Reservation>();
            CreateMap<Reservation,ReserveDto>();
            CreateMap<CreateElectricCharagerDto, ElectricCharger>();
            CreateMap<ElectricCharger, CreateElectricCharagerDto>();
                

        }

    }
}
