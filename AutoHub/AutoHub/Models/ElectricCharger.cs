namespace AutoHub.Models
{
    public class ElectricCharger
    {
        public int Id { get; set; }


        public string Name { get; set; }
        public string CountryName { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public bool IsVerified { get; set; }
        public int Price { get; set; }
        public string VerificationDocument {  get; set; }
        public string? Description { get; set; }
        public int AvailableSpots { get; set; }
        public string ChargerType { get; set; }

        public int OwnerId { get; set; }
        public User Owner { get; set; } = new User();
    }
}
