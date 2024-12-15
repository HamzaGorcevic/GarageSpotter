using AutoHub.Dtos;
using AutoHub.Models;
using AutoHub.Models.Enums;
using AutoHub.Services;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
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
        private readonly IEmailService _emailService;
        private readonly IMemoryCache _cache; // Inject MemoryCache

        public AuthRepository(AppDbContext appDbContext, IEmailService emailService, IMemoryCache cache, IConfiguration configuration, IMapper mapper, IHttpContextAccessor httpContextAccessor)
            : base(httpContextAccessor, appDbContext)
        {
            _appDbContext = appDbContext;
            _configuration = configuration;
            _mapper = mapper;
            _httpClient = new HttpClient();
            _emailService = emailService;
            _cache = cache;
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
                        IsEmailVerified = true,
                        Role = UserRole.User,
                        PasswordVerification = false
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
                response.Value = CreateToken(user.Name, user.Role, user.Id, user.Email, user.PasswordVerification);
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

        public async Task<ServiceResponse<string>> UpdatePassword(string password)
        {
            var response = new ServiceResponse<string>();

            var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Id == GetUserId());
            if (user == null)
            {
                response.Message = "User not found";
                response.Success = false;
                return response;
            }

            user.PasswordVerification = true;
            Console.WriteLine($"PasswordVerification before save: {user.PasswordVerification}");

            CreateHashPassword(password, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            // Force EF to track changes if necessary
            _appDbContext.Entry(user).Property(u => u.PasswordVerification).IsModified = true;

            await _appDbContext.SaveChangesAsync();

            response.Message = "Successfully updated password";
            response.Value = "Updated";
            response.Success = true;

            return response;
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
            response.Value = CreateToken(user.Name, user.Role, user.Id, user.Email, user.PasswordVerification);
            return response;
        }

        public async Task<ServiceResponse<string>> Register(RegisterDto registerDto)
        {
            var response = new ServiceResponse<string>();
            if (registerDto.IsGoogleLogin.HasValue && registerDto.IsGoogleLogin.Value)
            {
                return await LoginWithGoogle(registerDto.GoogleToken);
            }

            if (string.IsNullOrEmpty(registerDto.Email))
            {
                response.Success = false;
                response.Message = "Email is required for registration";
                return response;
            }

            // Check if the email is already registered
            var emailExists = await _appDbContext.Users.AnyAsync(u => u.Email == registerDto.Email);
            if (emailExists)
            {
                response.Success = false;
                response.Message = "User with that email already exists";
                return response;
            }

            if (string.IsNullOrEmpty(registerDto.Password))
            {
                response.Success = false;
                response.Message = "Password is required for registration";
                return response;
            }

            // Generate verification token
            var verificationToken = Guid.NewGuid().ToString();
            var tokenExpiry = DateTime.UtcNow.AddHours(24);

            // Store token temporarily (in-memory or cache)
            _cache.Set(verificationToken, new VerificationData
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                Password = registerDto.Password,
                Token = verificationToken,
                TokenExpiry = tokenExpiry
            });


            // Send verification email
            var verificationLink = $"{_configuration["AppUrl"]}/verify-email?token={verificationToken}";
            await _emailService.SendVerificationEmailAsync(registerDto.Email, verificationLink);

            response.Success = true;
            response.Message = "Registration successful. Please check your email to verify your account.";
            return response;
        }
        public async Task<ServiceResponse<string>> VerifyEmail(string token)
        {
            var response = new ServiceResponse<string>();

            if (!_cache.TryGetValue(token, out VerificationData verificationData))
            {
                response.Success = false;
                response.Message = "Invalid or expired verification token";
                return response;
            }

            // Check token expiry
            if (verificationData.TokenExpiry < DateTime.UtcNow)
            {
                response.Success = false;
                response.Message = "Verification token has expired";
                return response;
            }

            // Create and save the new user
            CreateHashPassword(verificationData.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var newUser = new User
            {
                Email = verificationData.Email,
                Name = verificationData.Name,
                Role = UserRole.User,
                IsEmailVerified = true,
                VerificationToken = token,
                VerificationTokenExpiry = verificationData.TokenExpiry,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                PasswordVerification = true
            };

            _appDbContext.Users.Add(newUser);
            await _appDbContext.SaveChangesAsync();

            // Remove the token from cache
            _cache.Remove(token);

            response.Success = true;
            response.Message = "Email verified successfully";
            response.Value = CreateToken(newUser.Name, newUser.Role, newUser.Id, newUser.Email, newUser.PasswordVerification);
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
            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found";
                return response;
            }
            if (VerifyHashPassword(password, user.PasswordHash, user.PasswordSalt) == false)
            {
                response.Success = false;
                response.Message = "Password is not correct";
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
            if (password == null || passwordHash == null || passwordSalt == null)
            {
                return false;
            }
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

        public string CreateToken(string name, UserRole role, int userId, string email, bool passwordVerification)
        {
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.Name, name));
            claims.AddClaim(new Claim(ClaimTypes.Role, role.ToString()));
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, userId.ToString()));
            claims.AddClaim(new Claim(ClaimTypes.Email, email));
            claims.AddClaim(new Claim("passwordVerification", passwordVerification.ToString()));

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