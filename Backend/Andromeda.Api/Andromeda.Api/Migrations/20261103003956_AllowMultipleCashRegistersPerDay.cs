using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Andromeda.Api.Migrations
{
    /// <inheritdoc />
    public partial class AllowMultipleCashRegistersPerDay : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CashRegisters_Date",
                table: "CashRegisters");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_CashRegisters_Date",
                table: "CashRegisters",
                column: "Date",
                unique: true);
        }
    }
}
