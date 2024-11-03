using AutoHub.Models;
using System.Collections.Generic;

namespace AutoHub.Models
{
    public class GarageSpot
    {
        public int Id { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string CountryName { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;

        public bool IsVerified { get; set; } = false;
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public int OwnerId { get; set; }
        public User Owner { get; set; } = new User();

        public string VerificationDocument { get; set; } = string.Empty;
        public List<SingleSpot> TotalSpots { get; set; } = new List<SingleSpot>();

        public int Price {  get; set; } 
        public List<string> ?GarageImages { get; set; } = new List<string>();
    }
}
