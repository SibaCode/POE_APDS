using Microsoft.EntityFrameworkCore;
using IntPaymentAPI.Models;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Identity;
using IntPaymentAPI; // Required for accessing ApplicationDbContext

var builder = WebApplication.CreateBuilder(args);

// Set specific URL (ensure this matches your desired port)
builder.WebHost.UseUrls("https://localhost:7150");

// Register the DbContext for Identity and Payments (with correct connection string)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); // Ensure DefaultConnection is in your appsettings.json

// Register Controllers (for all API routes)
builder.Services.AddControllers();

// Add Swagger (only in development environment)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS - Define the "AllowReactApp" policy with explicit headers
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "https://sibareactfe-hzcnaxcfdqbyaddc.southafricanorth-01.azurewebsites.net/",  // Local React dev
            "https://sibapayment-cubwerbvhzfpbmg8.southafricanorth-01.azurewebsites.net" // Your deployed React frontend
        )
        .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .WithHeaders("Content-Type", "Authorization", "Accept", "Origin")
        .AllowCredentials();
    });
});
var app = builder.Build();

// Apply the CORS policy for all incoming requests
app.UseCors("AllowReactApp");  // Ensure this is applied before routing
app.Use((context, next) =>
{
    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin");
    context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
    return next();
});
// Use Swagger only in dev
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "IntPaymentAPI v1");
    c.RoutePrefix = "swagger"; // So it loads at /swagger
});

// Middleware pipeline
app.UseHttpsRedirection(); // Enforce HTTPS
app.UseRouting();
app.UseAuthorization();
app.MapControllers(); // Map the controllers to endpoints

// Start the application
app.Run();
