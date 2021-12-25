using API.Controllers.DTO;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        public DataContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDTO registerDto)
        {
            if (await UserExists(registerDto.UserName) == true)
            {
                return BadRequest("User name already taken");
            }
            else
            {
                using var hmac = new HMACSHA512();
                var user = new AppUser
                {
                    UserName = registerDto.UserName.ToLower(),
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                    PasswordSalt = hmac.Key
                };
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                return new UserDto { UserName = user.UserName, Token = _tokenService.CreateToken(user) };
            }
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.Include(i=>i.Photos)
                .SingleOrDefaultAsync(i => i.UserName == loginDto.UserName);
            if (user == null) return Unauthorized("Invalid username");
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }
            return new UserDto { UserName = user.UserName, Token = _tokenService.CreateToken(user),PhotoUrl= user.Photos.FirstOrDefault(x=>x.IsMain)?.Url };
        }
        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(i => i.UserName == username.ToLower());
        }
    }
}
