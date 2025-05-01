using Microsoft.EntityFrameworkCore;
using IntPaymentAPI.Models;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Identity;
using IntPaymentAPI; 

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

// Add CORS - Define both the "AllowAll" and "AllowReactApp" policies
  builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3001", // Local React dev
            "https://sibapayment-cubwerbvhzfpbmg8.southafricanorth-01.azurewebsites.net" // Your actual deployed React frontend
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});
// Add rate limiting
builder.Services.AddOptions();
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddInMemoryRateLimiting(); // Ensure this is set up correctly

// Configure Identity for authentication (if needed)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var app = builder.Build();

// Use CORS policies
app.UseCors(builder.Environment.IsDevelopment() ? "AllowAll" : "AllowReactApp");  // Apply appropriate CORS policy

// Use Swagger only in dev
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "IntPaymentAPI v1");
    c.RoutePrefix = "swagger"; // So it loads at /swagger
});

// Middleware pipeline
app.UseIpRateLimiting(); // Rate limiting middleware
app.UseHttpsRedirection(); // Enforce HTTPS
app.UseRouting();
app.UseAuthorization();

// Ensure that Identity is enabled if you want authentication
app.MapControllers(); // Map the controllers to endpoints

app.Run();  // Start the application
