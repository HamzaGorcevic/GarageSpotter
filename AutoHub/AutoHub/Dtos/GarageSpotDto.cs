namespace AutoHub.Models
{
    public class GarageSpotDto
    {
        public int Id { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string CountryName { get; set; } = string.Empty;

        public bool IsAvailable { get; set; } = true;

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string VerificationDocument { get; set; } = string.Empty;
        public List<SingleSpot> TotalSpots { get; set; } = new List<SingleSpot>();
        public int Price { get; set; }
        public List<string>? GarageImages { get; set; } = new List<string>();
    }
}
