using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Andromeda.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceAndUpdateCharge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Charges_StudentCrew_StudentCrewId",
                table: "Charges");

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountAmount",
                table: "Charges",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<decimal>(
                name: "Amount",
                table: "Charges",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddColumn<int>(
                name: "PriceId",
                table: "Charges",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Prices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    CrewLevel = table.Column<int>(type: "integer", nullable: true),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prices", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Charges_PriceId",
                table: "Charges",
                column: "PriceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Charges_Prices_PriceId",
                table: "Charges",
                column: "PriceId",
                principalTable: "Prices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Charges_StudentCrew_StudentCrewId",
                table: "Charges",
                column: "StudentCrewId",
                principalTable: "StudentCrew",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Charges_Prices_PriceId",
                table: "Charges");

            migrationBuilder.DropForeignKey(
                name: "FK_Charges_StudentCrew_StudentCrewId",
                table: "Charges");

            migrationBuilder.DropTable(
                name: "Prices");

            migrationBuilder.DropIndex(
                name: "IX_Charges_PriceId",
                table: "Charges");

            migrationBuilder.DropColumn(
                name: "PriceId",
                table: "Charges");

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountAmount",
                table: "Charges",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Amount",
                table: "Charges",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AddForeignKey(
                name: "FK_Charges_StudentCrew_StudentCrewId",
                table: "Charges",
                column: "StudentCrewId",
                principalTable: "StudentCrew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
