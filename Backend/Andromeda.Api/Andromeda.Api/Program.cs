using Andromeda.Api.Data;
using Andromeda.Api.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString(
            "DefaultConnection")
    )
);

// Services
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<CrewService>();
builder.Services.AddScoped<StudentCrewService>();

builder.Services.AddScoped<PriceService>();
builder.Services.AddScoped<ChargeService>();
builder.Services.AddScoped<ChargeGenerationService>();

builder.Services.AddScoped<PaymentService>();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();