using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoHub.Migrations
{
    /// <inheritdoc />
    public partial class OwnerEChargerId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "ElectricChargers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ElectricChargers_OwnerId",
                table: "ElectricChargers",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_ElectricChargers_Users_OwnerId",
                table: "ElectricChargers",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ElectricChargers_Users_OwnerId",
                table: "ElectricChargers");

            migrationBuilder.DropIndex(
                name: "IX_ElectricChargers_OwnerId",
                table: "ElectricChargers");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "ElectricChargers");
        }
    }
}
