using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Andromeda.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceValidityDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Prices");

            migrationBuilder.AddColumn<DateOnly>(
                name: "ValidFrom",
                table: "Prices",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateOnly>(
                name: "ValidTo",
                table: "Prices",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValidFrom",
                table: "Prices");

            migrationBuilder.DropColumn(
                name: "ValidTo",
                table: "Prices");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Prices",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
