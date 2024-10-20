﻿using AutoHub.Models.Enums;
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

        public List<GarageSpot>? GarageSpots { get; set; }
    }
}
