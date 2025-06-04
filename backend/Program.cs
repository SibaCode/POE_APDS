using Microsoft.EntityFrameworkCore;
using IntPaymentAPI.Models;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Identity;
using IntPaymentAPI;

var builder = WebApplication.CreateBuilder(args);

// Set specific URL (ensure this matches your desired port)
builder.WebHost.UseUrls("https://localhost:7150");

// Register services
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Controllers
builder.Services.AddControllers();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "https://sibareactfe-hzcnaxcfdqbyaddc.southafricanorth-01.azurewebsites.net",
                "https://sibapayment-cubwerbvhzfpbmg8.southafricanorth-01.azurewebsites.net"
            )
            .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .WithHeaders("Content-Type", "Authorization", "Accept", "Origin")
            .AllowCredentials();
    });
});

var app = builder.Build();

// Middleware pipeline
app.UseHttpsRedirection();

// CORS should come after routing and before authorization
app.UseRouting();
app.UseCors("AllowReactApp"); 

app.UseAuthorization();

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "IntPaymentAPI v1");
    c.RoutePrefix = "swagger";
});

app.MapControllers();

app.Run();
