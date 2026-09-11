using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Andromeda.Api.Migrations
{
    /// <inheritdoc />
    public partial class RefactorChargeAndStudentCrew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentCrew",
                table: "StudentCrew");

            migrationBuilder.DropColumn(
                name: "Month",
                table: "Charges");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "Charges");

            migrationBuilder.RenameColumn(
                name: "Discount",
                table: "Charges",
                newName: "DiscountAmount");

            migrationBuilder.RenameColumn(
                name: "CrewId",
                table: "Charges",
                newName: "StudentCrewId");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Students",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "StudentCrew",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<DateOnly>(
                name: "BillingPeriod",
                table: "Charges",
                type: "date",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentCrew",
                table: "StudentCrew",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCrew_StudentId_CrewId",
                table: "StudentCrew",
                columns: new[] { "StudentId", "CrewId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Charges_StudentCrewId",
                table: "Charges",
                column: "StudentCrewId");

            migrationBuilder.AddForeignKey(
                name: "FK_Charges_StudentCrew_StudentCrewId",
                table: "Charges",
                column: "StudentCrewId",
                principalTable: "StudentCrew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Charges_StudentCrew_StudentCrewId",
                table: "Charges");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentCrew",
                table: "StudentCrew");

            migrationBuilder.DropIndex(
                name: "IX_StudentCrew_StudentId_CrewId",
                table: "StudentCrew");

            migrationBuilder.DropIndex(
                name: "IX_Charges_StudentCrewId",
                table: "Charges");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "StudentCrew");

            migrationBuilder.DropColumn(
                name: "BillingPeriod",
                table: "Charges");

            migrationBuilder.RenameColumn(
                name: "StudentCrewId",
                table: "Charges",
                newName: "CrewId");

            migrationBuilder.RenameColumn(
                name: "DiscountAmount",
                table: "Charges",
                newName: "Discount");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Students",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Month",
                table: "Charges",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "Charges",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentCrew",
                table: "StudentCrew",
                columns: new[] { "StudentId", "CrewId" });
        }
    }
}
