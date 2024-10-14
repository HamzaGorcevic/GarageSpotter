using AutoHub.Models;

namespace AutoHub.Services
{
    public interface IReservationService
    {
        Task<ServiceResponse<int>> ReserveGarageSpot(ReserveDto reserveDto);
        Task<ServiceResponse<int>> CancelReservation(CancelReservationDto cancelDto);
        Task<ServiceResponse<List<Reservation>>> GetUserReservations(int userId);
        Task<ServiceResponse<int>> TravelerReserveGarageSpot(ReserveDto reserveDto);

    }
}
