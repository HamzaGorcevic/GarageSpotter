using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoHub.Migrations
{
    /// <inheritdoc />
    public partial class SingleSpot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SingleSpots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    GarageSpotId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SingleSpots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SingleSpots_GarageSpots_GarageSpotId",
                        column: x => x.GarageSpotId,
                        principalTable: "GarageSpots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_SingleSpots_GarageSpotId",
                table: "SingleSpots",
                column: "GarageSpotId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SingleSpots");
        }
    }
}
