using System.Text.Json.Serialization;

namespace AutoHub.Models.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]

    public enum UserRole
    {
        Owner,      // Vlasnik garaže
        Driver,     // Vozač
        Traveler    // Putnik
    }

}
