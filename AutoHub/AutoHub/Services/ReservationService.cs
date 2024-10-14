using AutoHub.Data;
using AutoHub.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AutoHub.Services
{
    public class ReservationService :BaseService,IReservationService
    {
        private readonly AppDbContext _dbContext;

        public ReservationService(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor):base(httpContextAccessor)
        {
            _dbContext = dbContext;
        }

        public async Task<ServiceResponse<int>> ReserveGarageSpot(ReserveDto reserveDto)
        {
            var serviceResponse = new ServiceResponse<int>();
            var userId = GetUserId();

            var garageSpot = await _dbContext.GarageSpots
                .FirstOrDefaultAsync(g => g.Id == reserveDto.GarageSpotId && g.IsAvailable);

            if (garageSpot == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Garage spot not found or not available.";
                return serviceResponse;
            }

            var reservation = new Reservation
            {
                UserId = userId,
                GarageSpotId = garageSpot.Id,
                ReservationStart = reserveDto.ReservationStart,
                ReservationEnd = reserveDto.ReservationEnd,
                ReservationType = ReservationType.GarageSpot
            };

            garageSpot.IsAvailable = false; // Mark the garage spot as reserved
            await _dbContext.Reservations.AddAsync(reservation);
            await _dbContext.SaveChangesAsync();

            serviceResponse.Value = reservation.Id;
            serviceResponse.Success = true;
            serviceResponse.Message = "Garage spot reserved successfully.";
            return serviceResponse;
        }

        public async Task<ServiceResponse<int>> CancelReservation(CancelReservationDto cancelDto)
        {
            var serviceResponse = new ServiceResponse<int>();
            var reservation = await _dbContext.Reservations
                .Include(r => r.GarageSpot)
                .FirstOrDefaultAsync(r => r.Id == cancelDto.ReservationId);

            if (reservation == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Reservation not found.";
                return serviceResponse;
            }

            // Mark garage spot as available again
            reservation.GarageSpot.IsAvailable = true;
            _dbContext.Reservations.Remove(reservation);
            await _dbContext.SaveChangesAsync();

            serviceResponse.Value = reservation.Id;
            serviceResponse.Success = true;
            serviceResponse.Message = "Reservation cancelled successfully.";
            return serviceResponse;
        }
  

        public async Task<ServiceResponse<int>> TravelerReserveGarageSpot(ReserveDto reserveDto)
        {
            var response = new ServiceResponse<int>();

            var garageSpot = await _dbContext.GarageSpots.FindAsync(reserveDto.GarageSpotId);

            if (garageSpot == null || !garageSpot.IsAvailable)
            {
                response.Success = false;
                response.Message = "Garage spot not found or is not available.";
                return response;
            }

            var reservation = new Reservation
            {
                UserId = GetUserId(),
                GarageSpotId = reserveDto.GarageSpotId,
                ReservationStart = reserveDto.ReservationStart,
                ReservationEnd = reserveDto.ReservationEnd,
                ReservationType = ReservationType.GarageSpot
            };

            _dbContext.Reservations.Add(reservation);
            garageSpot.IsAvailable = false; // Mark as unavailable
            await _dbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "Garage spot reserved successfully.";
            response.Value = reservation.Id; // Return the reservation ID

            return response;
        }

        public Task<ServiceResponse<List<Reservation>>> GetUserReservations(int userId)
        {
            throw new NotImplementedException();
        }
    }
}
