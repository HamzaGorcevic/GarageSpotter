using AutoHub.Dtos;
using AutoHub.Models;
using AutoHub.Models.Enums;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AutoHub.Data
{
    public class AuthRepository :BaseService, IAuthRepository
    {
        AppDbContext _appDbContext;
        IConfiguration _configuration;
        IMapper _mapper;
        public AuthRepository(AppDbContext appDbContext,IConfiguration configuration,IMapper mapper,IHttpContextAccessor httpContextAccessor):base(httpContextAccessor,appDbContext)
        {
            _appDbContext = appDbContext;
            _configuration = configuration; 
            _mapper = mapper;   
        }

        public async Task<ServiceResponse<string>> Login(LoginDto loginDto)
        {
            var response = new ServiceResponse<string>();

            var user = await _appDbContext.Users.FirstOrDefaultAsync(u=>u.Email == loginDto.Email);

            if (user != null)
            {
                if (!VerifyHashPassword(loginDto.Password, user.PasswordHash, user.PasswordSalt))
                {
                    response.Success = false;
                    response.Message = "Wrong password";
                    return response;

                }
                response.Success = true;
                response.Message = "Succesffully logged in";
                response.Value = CreateToken(user.Name, user.Role,user.Id);
                return response;

                
                
            }
            response.Success = false;
            response.Message = "That user doesnt exist";
            return response;


        }

        public async Task<ServiceResponse<string>> Register(RegisterDto registerDto)
        {
            var userExists = await _appDbContext.Users.AnyAsync(u=>u.Email == registerDto.Email);

            var response = new ServiceResponse<string>();
            if (!userExists)
            {
                var newUser = _mapper.Map<User>(registerDto);
                newUser.Role = UserRole.User;
                CreateHashPassword(registerDto.Password, out byte[]passwordHash,out byte[] passwordSalt);

                newUser.PasswordHash = passwordHash;
                newUser.PasswordSalt = passwordSalt;
                _appDbContext.Users.Add(newUser);

                _appDbContext.SaveChanges();

                response.Success = true;
                response.Message = "Succesfully adedd";
                response.Value = "200";
                return response;

            }
            response.Success = false;
            response.Message = "User with that email does already  exist";
            return response;
        }
        public async Task<ServiceResponse<string>> ChangePassword( ChangePasswordDto changePasswordDto)
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
        public async Task<ServiceResponse<User>> EditUser( UpdateUserDto updateUserDto)
        {
            var response = new ServiceResponse<User>();
            var user = await _appDbContext.Users.FirstOrDefaultAsync(u=>u.Id==GetUserId());

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

        public bool VerifyHashPassword(string password, byte[] passwordHash,byte[] passwordSalt) {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {

                var computedHas = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

                for (int i = 0; i < computedHas.Length; i++)
                {
                    if(computedHas[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
                return true;    
            }
        
        }




        public void CreateHashPassword(string password, out byte[] passwordHash,out byte[] passwordSalt)
        {
            using (var hmc =new System.Security.Cryptography.HMACSHA512()) {
                passwordSalt = hmc.Key;
                passwordHash = hmc.ComputeHash(Encoding.UTF8.GetBytes(password));
            
            
            }
        }

        public string CreateToken(string name, UserRole role,int userId)
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
