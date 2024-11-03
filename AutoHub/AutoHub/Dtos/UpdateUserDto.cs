using AutoHub.Models.Enums;

namespace AutoHub.Dtos
{
    public class UpdateUserDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

}
