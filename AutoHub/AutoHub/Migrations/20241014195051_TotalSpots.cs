using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoHub.Migrations
{
    /// <inheritdoc />
    public partial class TotalSpots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FreeSpots",
                table: "GarageSpots");

            migrationBuilder.DropColumn(
                name: "TotalSpots",
                table: "GarageSpots");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "SingleSpots",
                newName: "IsAvailable");

            migrationBuilder.AddColumn<int>(
                name: "SingleSpotId",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_SingleSpotId",
                table: "Reservations",
                column: "SingleSpotId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_SingleSpots_SingleSpotId",
                table: "Reservations",
                column: "SingleSpotId",
                principalTable: "SingleSpots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_SingleSpots_SingleSpotId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_SingleSpotId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "SingleSpotId",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "IsAvailable",
                table: "SingleSpots",
                newName: "IsActive");

            migrationBuilder.AddColumn<int>(
                name: "FreeSpots",
                table: "GarageSpots",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalSpots",
                table: "GarageSpots",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
