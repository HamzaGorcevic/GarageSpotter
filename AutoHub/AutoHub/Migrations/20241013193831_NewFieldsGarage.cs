using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoHub.Migrations
{
    /// <inheritdoc />
    public partial class NewFieldsGarage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FreeSpots",
                table: "GarageSpots",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "GarageImages",
                table: "GarageSpots",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "TotalSpots",
                table: "GarageSpots",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "VerificationDocument",
                table: "GarageSpots",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FreeSpots",
                table: "GarageSpots");

            migrationBuilder.DropColumn(
                name: "GarageImages",
                table: "GarageSpots");

            migrationBuilder.DropColumn(
                name: "TotalSpots",
                table: "GarageSpots");

            migrationBuilder.DropColumn(
                name: "VerificationDocument",
                table: "GarageSpots");
        }
    }
}
