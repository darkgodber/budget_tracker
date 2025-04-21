using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BudgetTrackerContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
// Разрешаем CORS для React-приложения
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:8080", "https://budget-tracker.loca.lt") // адрес вашего React-приложения
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ...
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BudgetTrackerContext>();
    //db.Database.Migrate();
}


// Использование CORS (до использования эндпоинтов)
app.UseCors("AllowReactApp");

//app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();
app.Run();