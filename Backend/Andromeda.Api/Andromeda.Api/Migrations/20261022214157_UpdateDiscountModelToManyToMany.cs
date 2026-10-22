using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Andromeda.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDiscountModelToManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Discounts_DiscountId",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Payments_DiscountId",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "DiscountId",
                table: "Payments");

            migrationBuilder.RenameColumn(
                name: "Value",
                table: "Discounts",
                newName: "DiscountAmount");

            migrationBuilder.CreateTable(
                name: "PaymentDiscounts",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "integer", nullable: false),
                    DiscountId = table.Column<int>(type: "integer", nullable: false),
                    AppliedAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentDiscounts", x => new { x.PaymentId, x.DiscountId });
                    table.ForeignKey(
                        name: "FK_PaymentDiscounts_Discounts_DiscountId",
                        column: x => x.DiscountId,
                        principalTable: "Discounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PaymentDiscounts_Payments_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "Payments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentDiscounts_DiscountId",
                table: "PaymentDiscounts",
                column: "DiscountId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaymentDiscounts");

            migrationBuilder.RenameColumn(
                name: "DiscountAmount",
                table: "Discounts",
                newName: "Value");

            migrationBuilder.AddColumn<int>(
                name: "DiscountId",
                table: "Payments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_DiscountId",
                table: "Payments",
                column: "DiscountId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Discounts_DiscountId",
                table: "Payments",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id");
        }
    }
}
