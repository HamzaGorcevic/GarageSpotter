
using AutoHub.Data;
using AutoHub.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using AutoHub.GraphQl.Mutations;
using AutoHub.GraphQL.Types;
using HotChocolate.Authorization;
     
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace AutoHub
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            // postgresQL issue with date wich are requeired to be in utc format
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

            builder.Configuration["Token"] = Environment.GetEnvironmentVariable("TOKEN");
            builder.Configuration["AzureBlobStorage:ConnectionString"] = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");
            builder.Configuration["ConnectionStrings:DefaultConnection"] = Environment.GetEnvironmentVariable("DATABASE");
            builder.Configuration["Email:Password"] = Environment.GetEnvironmentVariable("gspassword");
            builder.Configuration["Google:ClientId"] = Environment.GetEnvironmentVariable("googleClientId");
            builder.Configuration["Google:ClientSecret"] = Environment.GetEnvironmentVariable("googleClientSecret");
            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
            builder.Services.AddHttpContextAccessor();

            // this is just to allow converting enum to string, add this at the top on enum [JsonConverter(typeof(JsonStringEnumConverter))]

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            //
            builder.Services.AddMemoryCache();
            builder.Services.AddScoped<CacheService>();
            builder.Services.AddScoped<IAuthRepository, AuthRepository>();
            builder.Services.AddScoped<IGarageSpotService, GarageSpotService>();
            builder.Services.AddScoped<IReservationService, ReservationService>();
            builder.Services.AddScoped<IAzureBlobService, AzureBlobService>();
            builder.Services.AddScoped<IAdminService, AdminService>();
            builder.Services.AddScoped<IElectricChargerService, ElectricChargerService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigins",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:5173", "http://192.168.0.105:5173", "https://garagespotterclient.onrender.com", "https://garagespotter-production.up.railway.app", "garagespotter-6f9840c8.railway.internal")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });

            });
            //


            // adding authenticator in swagger
            builder.Services.AddSwaggerGen(c =>
            {
                // Add Bearer Token Authentication
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme.  
                      Enter 'Bearer' [space] and then your token in the text input below.
                      Example: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                            {
                                {
                                    new OpenApiSecurityScheme
                                    {
                                        Reference = new OpenApiReference
                                        {
                                            Type = ReferenceType.SecurityScheme,
                                            Id = "Bearer"
                                        },
                                        Scheme = "oauth2",
                                        Name = "Bearer",
                                        In = ParameterLocation.Header,
                                    },
                                    new List<string>()
                                }
                            });
            });

            //


            // database connecting
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(connectionString);
            });
            //


            // adding authentication for token to be in header
            var tokenKey = Environment.GetEnvironmentVariable("TOKEN");
            var key = Encoding.ASCII.GetBytes(tokenKey);

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        RoleClaimType = ClaimTypes.Role
                    };
                })
                .AddGoogle(googleOptions =>
                {
                    googleOptions.ClientId = Environment.GetEnvironmentVariable("googleClientId");
                    googleOptions.ClientSecret = Environment.GetEnvironmentVariable("googleClientSecret");
                    googleOptions.CallbackPath = "/auth/google/callback";
                });

            // graphql

            // Add these to your services
            builder.Services
                .AddGraphQLServer()
                .AddType<UploadType>()
                .AddMutationType<Mutation>()
                .AddQueryType<Query>()
                .AddProjections()
                .AddFiltering()
                .AddSorting();


            var app = builder.Build();

            // Configure the HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowOrigins");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapGraphQL(); // GraphQL endpoint

            app.Run();
        }
    }
}
