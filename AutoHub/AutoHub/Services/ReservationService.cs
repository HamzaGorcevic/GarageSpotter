using AutoHub.Data;
using AutoHub.Models;
using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AutoHub.Services
{
    public class ReservationService :BaseService,IReservationService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public ReservationService(AppDbContext dbContext, IMapper mapper,IHttpContextAccessor httpContextAccessor):base(httpContextAccessor,dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<ServiceResponse<int>> ReserveSingleSpot(ReserveDto reserveDto)
        {
            await ClearReservations();
            var serviceResponse = new ServiceResponse<int>();
            var userId = GetUserId();
            var garageSpot = await _dbContext.GarageSpots
                .Include(gs => gs.TotalSpots) 
                .FirstOrDefaultAsync(g => g.Id == reserveDto.GarageSpotId);

            if (garageSpot == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Garage spot not found.";
                return serviceResponse;
            }
            if (reserveDto.ReservationStart.HasValue && reserveDto.ReservationEnd.HasValue)
            {
                var singleSpotCurrentlyBusy = garageSpot.TotalSpots.ToList();
                foreach (var spot in singleSpotCurrentlyBusy)
                {
                    if (IsSpotAvailableForPeriod(spot.Id, reserveDto.ReservationStart.Value, reserveDto.ReservationEnd.Value))
                    {
                        if(reserveDto.ReservationStart <= reserveDto.ReservationStarted)
                        {
                            spot.IsAvailable = false;
                            _dbContext.Entry(spot).State = EntityState.Modified;
                        }
                        var dateReservation = _mapper.Map<Reservation>(reserveDto);
                        dateReservation.SingleSpotId = spot.Id;
                        dateReservation.UserId = userId;
                        await _dbContext.Reservations.AddAsync(dateReservation);
                        await _dbContext.SaveChangesAsync();
                        serviceResponse.Success = true;
                        serviceResponse.Message = $"Garage reserved in period from {reserveDto.ReservationStart.Value.ToShortDateString()} to {reserveDto.ReservationEnd.Value.ToShortDateString()}.";
                        return serviceResponse;
                    }

                }

            }

            var singleSpot = garageSpot.TotalSpots.FirstOrDefault(s => s.IsAvailable);
            if (singleSpot == null)
            {
                
                serviceResponse.Success = false;
                serviceResponse.Message = "No available spots in this garage.";
                return serviceResponse;
            }

            var reservation = _mapper.Map<Reservation>(reserveDto);
            reservation.SingleSpotId = singleSpot.Id;
            reservation.UserId = userId;
            reservation.ReservationStart = null;
            reservation.ReservationEnd = null;

            singleSpot.IsAvailable = false;

            if(!garageSpot.TotalSpots.Any(g=>g.IsAvailable == true))
            {
                garageSpot.IsAvailable = false;
            }
            else
            {
                garageSpot.IsAvailable = true;
            }
  

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

            reservation.SingleSpot.IsAvailable = true;

            _dbContext.Reservations.Remove(reservation);
            await _dbContext.SaveChangesAsync();

            serviceResponse.Value = reservation.Id;
            serviceResponse.Success = true;
            serviceResponse.Message = "Reservation cancelled successfully.";

            return serviceResponse;
        }


        public async Task<ServiceResponse<List<ReserveDto>>> GetUserReservations()
        {
            await ClearReservations();
            var response = new ServiceResponse<List<ReserveDto>>();

            var reservations =await _dbContext.Reservations.Where(r => r.UserId == GetUserId()).Include(r=>r.SingleSpot).ToListAsync();
            var reservationsDto = _mapper.Map<List<ReserveDto>>(reservations);

            // remove expired reservations

            if(reservations.Count == 0)
            {
                response.Success = false;
                response.Message = "User doesnt have any reservation";
                response.Value = [];
                return response;
            }
            response.Success = true;
            response.Message = "Succesfuly found reservations";
            response.Value = reservationsDto;

            await _dbContext.SaveChangesAsync();
            return response;

        }
        public async Task<ServiceResponse<int>> ExtendReservation(ReserveDto updatedReserveDto)
        {
            var response = new ServiceResponse<int>();

            var reservation = await _dbContext.Reservations.FirstOrDefaultAsync(r => r.Id == updatedReserveDto.Id);

            if (reservation == null)
            {
                response.Success = false;
                response.Message = "Reservation not found";
                response.Value = 0;
                return response;
            }

            // Scenario 1: Reservation is by date-to-date (start and end dates exist)
            if (reservation.ReservationStart.HasValue && reservation.ReservationEnd.HasValue)
            {
                // Extend the reservation by adding new hours if provided
                if (updatedReserveDto.Hours.HasValue)
                {
                    int newHours = updatedReserveDto.Hours.Value;
                    reservation.ReservationEnd = reservation.ReservationEnd.Value.AddHours(newHours);

                    // Set Hours to null as it's extended by date
                    reservation.Hours = null;
                }
                else if (updatedReserveDto.ReservationEnd.HasValue)
                {
                    // Extend with a new ReservationEnd if provided
                    reservation.ReservationEnd = updatedReserveDto.ReservationEnd;
                }
            }
            // Scenario 2: Reservation is by hours (only hours exist)
            else if (reservation.Hours.HasValue)
            {
                if (updatedReserveDto.ReservationEnd.HasValue)
                {
                    // Extend the reservation by setting a new ReservationStart and ReservationEnd
                    reservation.ReservationStart = updatedReserveDto.ReservationStarted;
                    reservation.ReservationEnd = updatedReserveDto.ReservationEnd;
                }
                else
                {
                    // Extend by adding new hours if applicable
                    if (updatedReserveDto.Hours.HasValue)
                    {
                        reservation.Hours += updatedReserveDto.Hours.Value;
                    }
                }
            }

            // Save changes to the database
            await _dbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "Successfully updated the reservation";
            response.Value = reservation.Id;
            return response;
        }




        private bool IsSpotAvailableForPeriod(int spotId, DateTime start, DateTime end)
        {
            var overlappingReservations = _dbContext.Reservations
                .Where(r => r.SingleSpotId == spotId &&
                            (
                                (r.ReservationStart <= start && r.ReservationEnd >= start) ||
                                (r.ReservationStart <= end && r.ReservationEnd >= end) ||
                                (r.ReservationStart >= start && r.ReservationEnd <= end) ||
                                (r.Hours.HasValue  && r.ReservationStarted.AddHours(r.Hours.Value) < start)
                            ))
                .ToList();

            return overlappingReservations.Count == 0;
        }
    }
}
