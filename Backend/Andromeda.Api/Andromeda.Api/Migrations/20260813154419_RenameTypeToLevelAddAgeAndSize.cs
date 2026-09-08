using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Andromeda.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameTypeToLevelAddAgeAndSize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Crews",
                newName: "Level");

            migrationBuilder.AddColumn<int>(
                name: "Size",
                table: "Crews",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Size",
                table: "Crews");

            migrationBuilder.RenameColumn(
                name: "Level",
                table: "Crews",
                newName: "Type");
        }
    }
}
