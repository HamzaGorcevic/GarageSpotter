using System;
using System.Security.Claims;

public class BaseService
{

	IHttpContextAccessor _httpContextAccessor;
	public BaseService(IHttpContextAccessor httpContextAccessor)
	{
		_httpContextAccessor = httpContextAccessor;

	}

	public int GetUserId()
	{

		var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;

		return userId != null ? int.Parse(userId) : 0;
	}
}
