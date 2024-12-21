using AutoHub.Data;
using AutoHub.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

public class BaseService
{

	IHttpContextAccessor _httpContextAccessor;
    public readonly AppDbContext _dbContext;
    private readonly CacheService _cacheService;
	public BaseService(IHttpContextAccessor httpContextAccessor,AppDbContext dbContext,CacheService cacheService)
	{
		_httpContextAccessor = httpContextAccessor;
        _dbContext = dbContext;
        _cacheService = cacheService;

	}

	public int GetUserId()
	{

		var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

		return userId != null ? int.Parse(userId) : 0;
	}

    public async Task ClearReservationsIfNeeded()
    {
        if (!_cacheService.ShouldCleanReservations())
        {
            return;
        }

        await ClearReservations();
        _cacheService.SetLastCleanupTime();
    }
    public async Task ClearReservations()
    {
        var expiredReservations = await _dbContext.Reservations
            .Include(r => r.SingleSpot)
            .Where(r => (r.Hours.HasValue && r.ReservationStarted.AddHours(r.Hours.Value) < DateTime.UtcNow) ||
                       (r.ReservationEnd.HasValue && r.ReservationEnd.Value < DateTime.UtcNow))
            .ToListAsync();

        if (expiredReservations.Any())
        {
            var spotIds = expiredReservations.Select(r => r.SingleSpotId).ToList();

            await _dbContext.SingleSpots
                .Where(s => spotIds.Contains(s.Id))
                .ExecuteUpdateAsync(s => s
                    .SetProperty(b => b.IsAvailable, true));

            var garageSpotIds = expiredReservations
                .Select(r => r.SingleSpot?.GarageSpotId)
                .Where(id => id.HasValue)
                .Distinct()
                .ToList();

            if (garageSpotIds.Any())
            {
                await _dbContext.GarageSpots
                    .Where(g => garageSpotIds.Contains(g.Id))
                    .ExecuteUpdateAsync(g => g
                        .SetProperty(b => b.IsAvailable, true));
            }

            _dbContext.Reservations.RemoveRange(expiredReservations);
            await _dbContext.SaveChangesAsync();
        }

        var spotsWithoutReservations = await _dbContext.SingleSpots
            .Where(s => !s.IsAvailable && !_dbContext.Reservations.Any(r => r.SingleSpotId == s.Id))
            .ToListAsync();

        if (spotsWithoutReservations.Any())
        {
            var garageSpotIds = spotsWithoutReservations
                .Select(s => s.GarageSpotId)
                .Distinct()
                .ToList();

            await _dbContext.SingleSpots
                .Where(s => spotsWithoutReservations.Select(sw => sw.Id).Contains(s.Id))
                .ExecuteUpdateAsync(s => s
                    .SetProperty(b => b.IsAvailable, true));

            // Batch update garage spots
            await _dbContext.GarageSpots
                .Where(g => garageSpotIds.Contains(g.Id))
                .ExecuteUpdateAsync(g => g
                    .SetProperty(b => b.IsAvailable, true));

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
