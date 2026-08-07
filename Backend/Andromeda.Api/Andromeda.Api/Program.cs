using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllers();
builder.Services.AddOpenApi(); // Esto usa el paquete que YA tenés instalado

var app = builder.Build();

// Configurar el pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // Interfaz profesional de pruebas
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();