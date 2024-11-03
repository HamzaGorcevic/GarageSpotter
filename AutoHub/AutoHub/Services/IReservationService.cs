using AutoHub.Models;

namespace AutoHub.Services
{
    public interface IReservationService
    {
        Task<ServiceResponse<int>> ReserveSingleSpot(ReserveDto reserveDto);
        Task<ServiceResponse<int>> CancelReservation(CancelReservationDto cancelDto);
        Task<ServiceResponse<List<ReserveDto>>> GetUserReservations();
        Task<ServiceResponse<int>> ExtendReservation(ReserveDto updatedReserveDto);

    }
}
