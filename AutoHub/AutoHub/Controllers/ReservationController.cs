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

        [HttpGet("getUserReservations")]
        [Authorize(Roles = "User,Owner")]

        public async Task<ServiceResponse<List<ReserveDto>>> GetUserReservations()
        {
            return await _reservationService.GetUserReservations();
        }

        [HttpPost("reserveSingleSpot")]
        [Authorize(Roles = "User,Owner")]
        public async Task<ServiceResponse<int>> UserReserveGarageSpot([FromBody] ReserveDto reserveDto)
        {
            return await _reservationService.ReserveSingleSpot(reserveDto);
        }
        [HttpPost("cancellgaragespot")]
        [Authorize(Roles = "User,Owner")]
        public async Task<ServiceResponse<int>> UserCancelledGaragaSpot([FromBody] CancelReservationDto cancelDto)
        {
            return await _reservationService.CancelReservation(cancelDto);
        }
        [HttpPut("extendReservation")]
        [Authorize(Roles ="User,Owner")]
        public async Task<ServiceResponse<int>> ExtendReservation(ReserveDto updatedReservationDto)
        {
            return await _reservationService.ExtendReservation(updatedReservationDto);
        }

    }
}
