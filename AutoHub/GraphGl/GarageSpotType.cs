using AutoHub.Dtos;
using HotChocolate.Types;

namespace AutoHub.GraphQL.Types
{
    public class GarageSpotType : ObjectType<GarageSpotDto>
    {
        protected override void Configure(IObjectTypeDescriptor<GarageSpotDto> descriptor)
        {
            descriptor.Field(g => g.Id).Type<NonNullType<IdType>>();
            descriptor.Field(g => g.LocationName).Type<StringType>();
            descriptor.Field(g => g.CountryName).Type<StringType>();
            descriptor.Field(g => g.IsAvailable).Type<BooleanType>();
            descriptor.Field(g => g.IsVerified).Type<BooleanType>();
            descriptor.Field(g => g.Latitude).Type<FloatType>();
            descriptor.Field(g => g.Longitude).Type<FloatType>();
            descriptor.Field(g => g.VerificationDocument).Type<StringType>();
            descriptor.Field(g => g.TotalSpots).Type<ListType<SingleSpotType>>();
            descriptor.Field(g => g.Price).Type<IntType>();
            descriptor.Field(g => g.GarageImages).Type<ListType<StringType>>();
        }
    }

    public class SingleSpotType : ObjectType<SingleSpot>
    {
        protected override void Configure(IObjectTypeDescriptor<SingleSpot> descriptor)
        {
            descriptor.Field(s => s.Id).Type<NonNullType<IdType>>();
            descriptor.Field(s => s.IsAvailable).Type<BooleanType>();
            descriptor.Field(s => s.GarageSpotId).Type<IntType>();
        }
    }
}