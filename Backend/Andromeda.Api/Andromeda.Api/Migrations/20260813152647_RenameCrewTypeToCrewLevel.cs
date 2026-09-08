using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Andromeda.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameCrewTypeToCrewLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Crews",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "Crews");
        }
    }
}
