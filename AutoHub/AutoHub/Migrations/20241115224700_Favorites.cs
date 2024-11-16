using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoHub.Migrations
{
    /// <inheritdoc />
    public partial class Favorites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "GarageSpots",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GarageSpots_UserId",
                table: "GarageSpots",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GarageSpots_Users_UserId",
                table: "GarageSpots",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GarageSpots_Users_UserId",
                table: "GarageSpots");

            migrationBuilder.DropIndex(
                name: "IX_GarageSpots_UserId",
                table: "GarageSpots");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "GarageSpots");
        }
    }
}
