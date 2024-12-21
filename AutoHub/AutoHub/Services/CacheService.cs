using Microsoft.Extensions.Caching.Memory;

public class CacheService
{
    private readonly IMemoryCache _cache;
    private const string LastCleanupKey = "LastReservationCleanup";

    public CacheService(IMemoryCache cache)
    {
        _cache = cache;
    }

    public bool ShouldCleanReservations()
    {
        if (!_cache.TryGetValue(LastCleanupKey, out DateTime lastCleanup))
        {
            return true;
        }

        return DateTime.UtcNow.Subtract(lastCleanup).TotalMinutes >= 5;
    }

    public void SetLastCleanupTime()
    {
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromHours(1));

        _cache.Set(LastCleanupKey, DateTime.UtcNow, cacheOptions);
    }
}