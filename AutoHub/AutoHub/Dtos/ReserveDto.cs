public class ReserveDto
{
    public int Id { get; set; }
    public int GarageSpotId { get; set; }
    public DateTime ReservationStart { get; set; }
    public DateTime ReservationEnd { get; set; }
    public DateTime ReservationStarted {  get; set; }   
    public int Hours { get; set; }
}

