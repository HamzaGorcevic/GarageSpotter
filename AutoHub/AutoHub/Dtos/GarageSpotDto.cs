namespace AutoHub.Models
{
    public class GarageSpotDto
    {
        public string LocationName { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string VerificationDocument { get; set; } = string.Empty;
        public int TotalSpots { get; set; }
        public int FreeSpots { get; set; }
        public int Price { get; set; }
        public List<string>? GarageImages { get; set; } = new List<string>();
    }
}
