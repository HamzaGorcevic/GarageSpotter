using AutoHub.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoHub.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        

        public DbSet<User> Users => Set<User>();
        public DbSet<GarageSpot> GarageSpots => Set<GarageSpot>();  
        public DbSet<Reservation> Reservations => Set<Reservation>();
        public DbSet<SingleSpot> SingleSpots => Set<SingleSpot>();
        public DbSet<ElectricCharger> ElectricChargers => Set<ElectricCharger>();


    }
}
