﻿using AutoHub.Models;
using AutoHub.Models.Enums;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AutoHub.Data
{
    public class AuthRepository : IAuthRepository
    {
        AppDbContext _appDbContext;
        IConfiguration _configuration;
        IMapper _mapper;
        public AuthRepository(AppDbContext appDbContext,IConfiguration configuration,IMapper mapper)
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
