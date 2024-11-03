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
        public ReservationService(AppDbContext dbContext, IMapper mapper,IHttpContextAccessor httpContextAccessor):base(httpContextAccessor)
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
        public async Task<ServiceResponse<int>> ExtendReservation(ReserveDto updatedReserveDto) {

            var response = new ServiceResponse<int>();

            var reservation= await _dbContext.Reservations.FirstOrDefaultAsync(r => r.Id == updatedReserveDto.Id);
            
            if(reservation == null)
            {
                response.Success = false;
                response.Message = "Reservation not found";
                response.Value = 0;
                return response;
            }
            
            
            reservation.Hours = updatedReserveDto.Hours;
            reservation.ReservationStart = updatedReserveDto.ReservationStart;
            reservation.ReservationEnd = updatedReserveDto.ReservationEnd;
            reservation.ReservationStarted =  updatedReserveDto.ReservationStarted;
            await _dbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "Succesfully found reservation";
            response.Value = reservation.Id;
            return response;
        
        }

        public async Task ClearReservations()
        {
            var allReservations = await _dbContext.Reservations
                .Include(r => r.SingleSpot) 
                .ToListAsync(); 

            var expiredReservations = allReservations.Where(r => IsExpired(r)).ToList();

            if (expiredReservations.Any())
            {
                foreach (var expiredReservation in expiredReservations)
                {
                    if (expiredReservation.SingleSpot != null)
                    {
                        expiredReservation.SingleSpot.IsAvailable = true;
                        _dbContext.Entry(expiredReservation.SingleSpot).State = EntityState.Modified;
                    }
                }

                await _dbContext.SaveChangesAsync();

                _dbContext.Reservations.RemoveRange(expiredReservations);

                await _dbContext.SaveChangesAsync();
            }
        }

        public bool IsExpired(Reservation r)
        {
            if (r.Hours != 0)
            {
                var expirationTime = r.ReservationStarted.AddHours(r.Hours.Value);
                return DateTime.UtcNow > expirationTime;
            }
            if (r.ReservationEnd.HasValue)
            {
                return DateTime.UtcNow > r.ReservationEnd.Value;
            }

            return false;
        }
    }
}
