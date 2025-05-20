using AutoHub.Controllers;
using AutoHub.Models;
using AutoHub.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace AutoHub.Tests.Controllers
{
    public class GarageSpotControllerTests
    {
        private readonly GarageSpotController _controller;
        private readonly Mock<IGarageSpotService> _mockService;

        public GarageSpotControllerTests()
        {
            _mockService = new Mock<IGarageSpotService>();
            _controller = new GarageSpotController(_mockService.Object);
        }

        [Fact]
        public async Task GetGarageSpotsByCountry_ReturnsCorrectData()
        {
            // Arrange
            var expectedResponse = new ServiceResponse<List<GarageSpotDto>>
            {
                Value = new List<GarageSpotDto>
                {
                    new GarageSpotDto
                    {
                        Id = 1,
                        LocationName = "Main St",
                        CountryName = "USA",
                        IsAvailable = true,
                        IsVerified = true,
                        Latitude = 10.0,
                        Longitude = 20.0,
                        Price = 50,
                        GarageImages = new List<string> { "img1.jpg" }
                    }
                },
                Success = true,
                Message = "Success"
            };

            _mockService
                .Setup(s => s.GetGarageSpotsByCountry("USA"))
                .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetGarageSpotsByCountry("USA");

            // Assert
            Assert.True(result.Success);
            Assert.Single(result.Value);
            Assert.Equal("USA", result.Value[0].CountryName);
        }

        [Fact]
        public async Task GetGarageSpots_ReturnsListOfSpots()
        {
            // Arrange
            var expectedResponse = new ServiceResponse<List<GarageSpotDto>>
            {
                Value = new List<GarageSpotDto>
                {
                    new GarageSpotDto { Id = 1, CountryName = "USA", LocationName = "Spot A" },
                    new GarageSpotDto { Id = 2, CountryName = "Canada", LocationName = "Spot B" }
                },
                Success = true
            };

            _mockService.Setup(s => s.GetGarageSpots()).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetGarageSpots();

            // Assert
            Assert.Equal(2, result.Value.Count);
        }

        [Fact]
        public async Task GetGarageSpot_ReturnsSpecificSpot()
        {
            // Arrange
            var expected = new ServiceResponse<GarageSpotDto>
            {
                Value = new GarageSpotDto { Id = 5, CountryName = "Germany", LocationName = "Berlin" },
                Success = true
            };

            _mockService.Setup(s => s.GetGarageSpot(5)).ReturnsAsync(expected);

            // Act
            var result = await _controller.GetGarageSpot(5);

            // Assert
            Assert.Equal(5, result.Value.Id);
            Assert.Equal("Germany", result.Value.CountryName);
        }

        [Fact]
        public async Task OwnerDeleteGarageSpot_ReturnsTrueOnSuccess()
        {
            // Arrange
            var expected = new ServiceResponse<bool>
            {
                Value = true,
                Success = true
            };

            _mockService.Setup(s => s.DeleteGarageSpot(10)).ReturnsAsync(expected);

            // Act
            var result = await _controller.OwnerDeleteGarageSpot(10);

            // Assert
            Assert.True(result.Success);
            Assert.True(result.Value);
        }
    }
}
