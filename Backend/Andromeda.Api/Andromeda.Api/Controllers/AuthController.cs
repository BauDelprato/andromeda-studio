using Andromeda.Api.DTOs.Auth;
using Andromeda.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("google")]
        public async Task<ActionResult<AuthResponse>> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            var result = await _authService.AuthenticateGoogleAsync(request);

            if (result == null)
            {
                return Unauthorized(new { message = "Usuario no autorizado o token de Google inválido." });
            }

            return Ok(result);
        }
    }
}