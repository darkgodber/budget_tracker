using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Models;
using System.Threading.Tasks;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

// EF Core + SQLite
builder.Services.AddDbContext<BudgetTrackerContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:3000", "http://localhost:8080", "https://budget-tracker.loca.lt")
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<BudgetTrackerContext>()
    .AddDefaultTokenProviders();

// JWT Authentication with logging
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opts =>
{
    opts.Events = new JwtBearerEvents
    {
        OnMessageReceived = ctx =>
        {
            Console.WriteLine("[JWT] Header Received: " + ctx.Request.Headers["Authorization"]);
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = ctx =>
        {
            Console.WriteLine("[JWT] Authentication Failed: " + ctx.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = ctx =>
        {
            var userId = ctx.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine("[JWT] Token Validated for User: " + userId);
            return Task.CompletedTask;
        }
    };
    opts.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BudgetTrackerContext>();
    db.Database.Migrate();
}

app.UseCors("AllowReactApp");
app.UseAuthentication();
if (app.Environment.IsDevelopment()) { app.UseDeveloperExceptionPage(); app.UseSwagger(); app.UseSwaggerUI(); }
app.UseAuthorization();
app.MapControllers();
app.Run();