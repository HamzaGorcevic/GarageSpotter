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

        public async Task<ServiceResponse<int>> ReserveSingleSpot(ReserveDto reserveDto)
        {
            var serviceResponse = new ServiceResponse<int>();
            var userId = GetUserId();

            var garageSpot = await _dbContext.GarageSpots
                .Include(gs => gs.TotalSpots) // Include the SingleSpots
                .FirstOrDefaultAsync(g => g.Id == reserveDto.GarageSpotId);

            if (garageSpot == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Garage spot not found.";
                return serviceResponse;
            }

            var singleSpot = garageSpot.TotalSpots.FirstOrDefault(s => s.IsAvailable);
            if (singleSpot == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "No available spots in this garage.";
                return serviceResponse;
            }

            var reservation = new Reservation
            {
                UserId = userId,
                GarageSpotId = garageSpot.Id,
                SingleSpotId = singleSpot.Id, 
                ReservationStart = reserveDto.ReservationStart,
                ReservationEnd = reserveDto.ReservationEnd,
            };

            // Mark the SingleSpot as unavailable
            singleSpot.IsAvailable = false;

            // Add the reservation and save changes
            await _dbContext.Reservations.AddAsync(reservation);
            await _dbContext.SaveChangesAsync();

            serviceResponse.Value = reservation.Id;
            serviceResponse.Success = true;
            serviceResponse.Message = "Single spot reserved successfully.";

            return serviceResponse;
        }


        public async Task<ServiceResponse<int>> CancelReservation(CancelReservationDto cancelDto)
        {
            var serviceResponse = new ServiceResponse<int>();
            var reservation = await _dbContext.Reservations
                .Include(r => r.SingleSpot) // Include the SingleSpot
                .FirstOrDefaultAsync(r => r.Id == cancelDto.ReservationId);

            if (reservation == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Reservation not found.";
                return serviceResponse;
            }

            // Mark SingleSpot as available again
            reservation.SingleSpot.IsAvailable = true;

            // Remove the reservation
            _dbContext.Reservations.Remove(reservation);
            await _dbContext.SaveChangesAsync();

            serviceResponse.Value = reservation.Id;
            serviceResponse.Success = true;
            serviceResponse.Message = "Reservation cancelled successfully.";

            return serviceResponse;
        }


        public Task<ServiceResponse<List<Reservation>>> GetUserReservations(int userId)
        {
            throw new NotImplementedException();
        }
    }
}
