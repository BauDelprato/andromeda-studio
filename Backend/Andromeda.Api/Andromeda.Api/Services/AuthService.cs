using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Auth;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Andromeda.Api.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<AuthResponse?> AuthenticateGoogleAsync(GoogleLoginRequest request)
        {
            // 1. Validar el Token con los servidores de Google
            var googleClientId = _config["GoogleAuth:ClientId"]
                ?? throw new InvalidOperationException("Falta configurar 'GoogleAuth:ClientId'.");

            GoogleJsonWebSignature.Payload payload;
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { googleClientId }
                };
                payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
            }
            catch
            {
                // El token no es válido o expiro
                return null;
            }

            // 2. Validar que el Email pertenezca a un estudiante/usuario de la base de datos (Whitelist)
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Email.ToLower() == payload.Email.ToLower() && s.IsActive);

            if (student == null)
            {
                // El usuario se autenticó en Google, pero NO está registrado en el sistema
                return null;
            }

            // 3. Generar el JWT interno para Andromeda
            var token = GenerateJwtToken(student.Email, student.Id);

            return new AuthResponse
            {
                Token = token,
                Email = student.Email,
                FirstName = student.FirstName,
                LastName = student.LastName
            };
        }

        private string GenerateJwtToken(string email, int studentId)
        {
            var secretKey = _config["JwtSettings:SecretKey"] 
                ?? throw new InvalidOperationException("Falta configurar 'JwtSettings:SecretKey'.");            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, studentId.ToString()),
                new Claim(ClaimTypes.Email, email)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // El token dura 7 días
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}