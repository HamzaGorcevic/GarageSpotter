using AutoHub.Models;

namespace AutoHub.Models
{
    public enum ReservationType
    {
        GarageSpot,
        ChargingStation,
        LongTermRental
    }
    public class Reservation
    {
        public int Id { get; set; }  

        public int UserId { get; set; }  
        public User User { get; set; }   

        public int GarageSpotId { get; set; }  
        public GarageSpot GarageSpot { get; set; } 

        public DateTime ReservationStart { get; set; }  
        public DateTime ReservationEnd { get; set; }   

        public ReservationType ReservationType { get; set; }  
    }

}
