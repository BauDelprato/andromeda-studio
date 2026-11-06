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
            if (string.IsNullOrWhiteSpace(request.IdToken))
                return null;

            // 1. Validar el ID token con los servidores de Google.
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
                return null;
            }

            if (!payload.EmailVerified || string.IsNullOrWhiteSpace(payload.Email))
                return null;

            var email = payload.Email.Trim();

           
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.IsActive && u.Email.ToLower() == email.ToLower());

            if (user == null)
            {
                return null;
            }


            return new AuthResponse
            {
                Token = GenerateJwtToken(user.Id, user.Email, user.Role),
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role
            };
        }

        private string GenerateJwtToken(int userId, string email, string role)
        {
            var secretKey = _config["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException("Falta configurar 'JwtSettings:SecretKey'.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expirationHours =
                int.TryParse(_config["JwtSettings:ExpirationHours"], out var hours) && hours > 0
                    ? hours
                    : 8;

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expirationHours),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
