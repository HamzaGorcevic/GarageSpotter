﻿using AutoHub.Dtos;
using AutoHub.Models;
using AutoHub.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace AutoHub.Data
{
    public interface IAuthRepository
    {
        public Task<ServiceResponse<string>> Login(LoginDto loginDto);
        public Task<ServiceResponse<string>> Register(RegisterDto registerDto);
        public Task<ServiceResponse<string>> ChangePassword(ChangePasswordDto changePasswordDto);
        public Task<ServiceResponse<User>> EditUser(UpdateUserDto updateUserDto);
        public Task<ServiceResponse<string>> DeleteProfile(string password);
        public string CreateToken(string name, UserRole role, int userId, string email, bool passwordVerification);
        public Task<ServiceResponse<string>> VerifyEmail(string token);
        public Task<ServiceResponse<string>> UpdatePassword(string password);
        public Task<ServiceResponse<string>> ResetPassword(ResetPasswordDto resetPasswordDto);
        public Task<ServiceResponse<string>> ResetPasswordRequest(string email);

    }
}
