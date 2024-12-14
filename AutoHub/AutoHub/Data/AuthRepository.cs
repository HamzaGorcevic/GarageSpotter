using AutoHub.Dtos;
using AutoHub.Models;
using AutoHub.Models.Enums;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AutoHub.Data
{
    public class AuthRepository : BaseService, IAuthRepository
    {
        private readonly AppDbContext _appDbContext;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;

        public AuthRepository(AppDbContext appDbContext, IConfiguration configuration, IMapper mapper, IHttpContextAccessor httpContextAccessor)
            : base(httpContextAccessor, appDbContext)
        {
            _appDbContext = appDbContext;
            _configuration = configuration;
            _mapper = mapper;
            _httpClient = new HttpClient();
        }

        public async Task<ServiceResponse<string>> LoginWithGoogle(string googleToken)
        {
            var response = new ServiceResponse<string>();
            try
            {
                var googleUserInfo = await GetGoogleUserInfo(googleToken);
                if (googleUserInfo == null)
                {
                    response.Success = false;
                    response.Message = "Invalid Google token";
                    return response;
                }

                var email = googleUserInfo["email"].ToString();
                var name = googleUserInfo["name"].ToString();
                var googleId = googleUserInfo["sub"].ToString();

                var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    // Auto-register the user if they don't exist
                    user = new User
                    {
                        Email = email,
                        Name = name,
                        GoogleId = googleId,
                        Role = UserRole.User
                    };
                    _appDbContext.Users.Add(user);
                    await _appDbContext.SaveChangesAsync();
                }
                else if (string.IsNullOrEmpty(user.GoogleId))
                {
                    // Link Google account to existing user
                    user.GoogleId = googleId;
                    _appDbContext.Users.Update(user);
                    await _appDbContext.SaveChangesAsync();
                }

                response.Success = true;
                response.Message = "Successfully logged in with Google";
                response.Value = CreateToken(user.Name, user.Role, user.Id);
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error processing Google login";
                return response;
            }
        }

        private async Task<Dictionary<string, object>> GetGoogleUserInfo(string token)
        {
            try
            {
                var userInfoResponse = await _httpClient.GetAsync($"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}");
                if (userInfoResponse.IsSuccessStatusCode)
                {
                    var jsonResponse = await userInfoResponse.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonResponse);
                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        public async Task<ServiceResponse<string>> Login(LoginDto loginDto)
        {
            var response = new ServiceResponse<string>();

            if (loginDto.IsGoogleLogin.HasValue && loginDto.IsGoogleLogin.Value)
            {
                return await LoginWithGoogle(loginDto.GoogleToken);
            }

            var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found";
                return response;
            }

            if (!VerifyHashPassword(loginDto.Password, user.PasswordHash, user.PasswordSalt))
            {
                response.Success = false;
                response.Message = "Wrong password";
                return response;
            }

            response.Success = true;
            response.Message = "Successfully logged in";
            response.Value = CreateToken(user.Name, user.Role, user.Id);
            return response;
        }

        public async Task<ServiceResponse<string>> Register(RegisterDto registerDto)
        {
            var response = new ServiceResponse<string>();
            string email;
            User newUser;

            if (registerDto.IsGoogleLogin.HasValue && registerDto.IsGoogleLogin.Value)
            {
                // Fetch Google user info
                var googleUserInfo = await GetGoogleUserInfo(registerDto.GoogleToken);
                if (googleUserInfo == null)
                {
                    response.Success = false;
                    response.Message = "Invalid Google token";
                    return response;
                }

                // Extract email from Google user info
                email = googleUserInfo["email"]?.ToString();
                if (string.IsNullOrEmpty(email))
                {
                    response.Success = false;
                    response.Message = "Email not found in Google user info";
                    return response;
                }

                // Check if a user with this Google ID already exists
                var existingGoogleUser = await _appDbContext.Users.FirstOrDefaultAsync(u => u.GoogleId == googleUserInfo["sub"].ToString());
                if (existingGoogleUser != null)
                {
                    response.Success = false;
                    response.Message = "User with this Google account already exists";
                    return response;
                }

                // Map user for Google registration
                newUser = new User
                {
                    Email = email,
                    GoogleId = googleUserInfo["sub"].ToString(),
                    Name = googleUserInfo["name"]?.ToString(),
                    Role = UserRole.User,
                    PasswordHash = null,
                    PasswordSalt = null
                };
            }
            else
            {
                // For regular registration, use the email from registerDto
                email = registerDto.Email;
                if (string.IsNullOrEmpty(email))
                {
                    response.Success = false;
                    response.Message = "Email is required for registration";
                    return response;
                }

                // Check if the email already exists
                var userExists = await _appDbContext.Users.AnyAsync(u => u.Email == email);
                if (userExists)
                {
                    response.Success = false;
                    response.Message = "User with that email already exists";
                    return response;
                }

                // Validate password for regular registration
                if (string.IsNullOrEmpty(registerDto.Password))
                {
                    response.Success = false;
                    response.Message = "Password is required for regular registration";
                    return response;
                }

                // Handle password hashing for non-Google registration
                CreateHashPassword(registerDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

                // Map user for regular registration
                newUser = new User
                {
                    Email = email,
                    Name = registerDto.Name,
                    Role = UserRole.User,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt
                };
            }

            // Add the new user to the database
            _appDbContext.Users.Add(newUser);
            await _appDbContext.SaveChangesAsync();

            // Generate token
            response.Success = true;
            response.Message = "Successfully registered";
            response.Value = CreateToken(newUser.Name, newUser.Role, newUser.Id);
            return response;
        }


        public async Task<ServiceResponse<string>> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var response = new ServiceResponse<string>();
            var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Id == GetUserId());

            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found";
                return response;
            }

            if (!VerifyHashPassword(changePasswordDto.CurrentPassword, user.PasswordHash, user.PasswordSalt))
            {
                response.Success = false;
                response.Message = "Current password is incorrect";
                return response;
            }

            CreateHashPassword(changePasswordDto.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _appDbContext.Users.Update(user);
            await _appDbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "Password changed successfully";
            response.Value = "200";
            return response;
        }

        public async Task<ServiceResponse<User>> EditUser(UpdateUserDto updateUserDto)
        {
            var response = new ServiceResponse<User>();
            var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Id == GetUserId());

            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found";
                return response;
            }

            user.Name = updateUserDto.Name;
            user.Email = updateUserDto.Email;

            _appDbContext.Users.Update(user);
            await _appDbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "User updated successfully";
            response.Value = user;
            return response;
        }

        public async Task<ServiceResponse<string>> DeleteProfile(string password)
        {
            var response = new ServiceResponse<string>();
            var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Id == GetUserId());
            if (VerifyHashPassword(password, user.PasswordHash, user.PasswordSalt) == false)
            {
                response.Success = false;
                response.Message = "Password is not correct";
                return response;
            }
            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found";
                return response;
            }

            _appDbContext.Users.Remove(user);
            await _appDbContext.SaveChangesAsync();

            response.Success = true;
            response.Message = "User deleted successfully";
            return response;
        }

        private bool VerifyHashPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(passwordHash);
        }

        private void CreateHashPassword(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        public string CreateToken(string name, UserRole role, int userId)
        {
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.Name, name));
            claims.AddClaim(new Claim(ClaimTypes.Role, role.ToString()));
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, userId.ToString()));

            var handler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration.GetSection("Token").Value);
            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = credentials,
            };

            var token = handler.CreateToken(tokenDescriptor);
            return handler.WriteToken(token);
        }

    
    }
}