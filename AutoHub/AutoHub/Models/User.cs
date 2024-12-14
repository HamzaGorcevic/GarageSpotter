using AutoHub.Models.Enums;

namespace AutoHub.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public byte[]? PasswordHash { get; set; }
        public byte[]? PasswordSalt { get; set; }
        public UserRole Role { get; set; }
        public string? GoogleId { get; set; }
        public DateTime? VerificationTokenExpiry { get; set; }
        public bool PasswordVerification = true;
        public string ?VerificationToken { get; set; }
        public bool IsEmailVerified { get; set; }


        public List<GarageSpot>? GarageSpots
        {
            get => Role == UserRole.Owner ? _garageSpots : null;
            set { if (Role == UserRole.Owner) _garageSpots = value; }
        }
        private List<GarageSpot>? _garageSpots;

        public List<ElectricCharger>? ElectricChargers
        {
            get => Role == UserRole.Owner ? _electricChargers : null;
            set { if (Role == UserRole.Owner) _electricChargers = value; }
        }
        private List<ElectricCharger>? _electricChargers;

        public List<GarageSpot>? Favorites
        {
            get => Role != UserRole.Admin ? _favorites : null;
            set { if (Role != UserRole.Admin) _favorites = value; }
        }
        private List<GarageSpot>? _favorites;
    }
}
