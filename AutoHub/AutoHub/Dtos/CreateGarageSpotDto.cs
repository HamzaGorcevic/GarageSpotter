namespace AutoHub.Dtos
{
    public class CreateGarageSpotDto
    {
        public string LocationName { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public double Longitude { get; set; }
        public string VerificationDocument { get; set; } = string.Empty;    
        public int NumberOfSpots { get; set; } 
        public int Price { get; set; }
        public List<string> ?GarageImages { get; set; }
    }
}
