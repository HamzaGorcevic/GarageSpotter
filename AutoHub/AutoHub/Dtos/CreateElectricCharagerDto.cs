namespace AutoHub.Dtos
{
    public class CreateElectricCharagerDto
    {
        public string Name { get; set; }
        public string CountryName { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string ChargerType { get; set; }

        public int Price { get; set; }
        public string? Description { get; set; }
        public int AvailableSpots { get; set; }

    }
}
