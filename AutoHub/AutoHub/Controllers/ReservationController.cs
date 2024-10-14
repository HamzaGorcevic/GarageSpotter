using AutoHub.Models;
using AutoHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IGarageSpotService _garageSpotService;
        private readonly IReservationService _reservationService;

        public ReservationController(IGarageSpotService garageSpotService, IReservationService reservationService)
        {
            _garageSpotService = garageSpotService;
            _reservationService = reservationService;
        }

        [HttpPost("userreserve")]
        [Authorize(Roles = "User")]
        public async Task<ServiceResponse<int>> UserReserveGarageSpot([FromBody] ReserveDto reserveDto)
        {
            return await _reservationService.ReserveGarageSpot(reserveDto);
        }

        [HttpPost("travelerreserve")]
        [Authorize(Roles = "Traveler")]
        public async Task<ServiceResponse<int>> TravelerReserveGarageSpot([FromBody] ReserveDto reserveDto)
        {
            return await _reservationService.TravelerReserveGarageSpot(reserveDto);
        }

        [HttpPost("usercancelledgaragespot")]
        [Authorize(Roles = "User")]
        public async Task<ServiceResponse<int>> UserCancelledGaragaSpot([FromBody] CancelReservationDto cancelDto)
        {
            return await _reservationService.CancelReservation(cancelDto);
        }
    }
}
