using AutoHub.Data;
using AutoHub.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

public class BaseService
{

	IHttpContextAccessor _httpContextAccessor;
    private readonly AppDbContext _dbContext;
	public BaseService(IHttpContextAccessor httpContextAccessor,AppDbContext dbContext)
	{
		_httpContextAccessor = httpContextAccessor;
        _dbContext = dbContext;

	}

	public int GetUserId()
	{

		var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;

		return userId != null ? int.Parse(userId) : 0;
	}
    public async Task ClearReservations()
    {
        var totalSpots = await _dbContext.SingleSpots.ToListAsync();
        bool spotsUpdated = false;

        foreach (var spot in totalSpots)
        {
            var anyRes = await _dbContext.Reservations.AnyAsync(r => r.SingleSpotId == spot.Id);
            if (!anyRes && !spot.IsAvailable)
            {
                var freeGarage = await _dbContext.GarageSpots.FirstOrDefaultAsync(r => r.Id == spot.GarageSpotId);

                if (freeGarage != null && !freeGarage.IsAvailable)
                {
                    freeGarage.IsAvailable = true;
                    _dbContext.Entry(freeGarage).State = EntityState.Modified;
                }

                spot.IsAvailable = true;
                _dbContext.Entry(spot).State = EntityState.Modified;
                spotsUpdated = true;
            }
        }

        if (spotsUpdated)
        {
            await _dbContext.SaveChangesAsync();
        }

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
        if (r.Hours.HasValue && r.Hours.Value >0)
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
