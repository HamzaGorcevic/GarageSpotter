﻿using AutoHub.Models.Enums;
using System;

public class RegisterDto
{
	public string Name { get; set; } = string.Empty;
	public string Email { get; set; } = string.Empty;
	public string Password { get; set; } = string.Empty;

	public UserRole Role {  get; set; }
	
}
