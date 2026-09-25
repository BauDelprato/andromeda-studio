using System.Text;
using Andromeda.Api.Data;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // URLs de tu Frontend (React/Vite, Next, etc.)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


builder.Services.AddControllers();


var jwtSecretKey = builder.Configuration["JwtSettings:SecretKey"] 
    ?? throw new InvalidOperationException("Falta configurar 'JwtSettings:SecretKey' en los secretos.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

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
//builder.Services.AddScoped<AuthService>();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();