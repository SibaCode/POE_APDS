using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IntPaymentAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using BCrypt.Net;
using System.Linq;
using IntPaymentAPI; 

namespace IntPaymentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
private readonly ILogger<CustomersController> _logger;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }
[HttpPost("register")]
    public async Task<ActionResult<Customer>> Register(RegisterModel model)
    {
        if (model == null)
            return BadRequest("Invalid data.");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

        var customer = new Customer
        {
            FullName = model.FullName.Trim(),
            AccountNumber = model.AccountNumber.Trim(),
            PasswordHash = passwordHash,
            IDNumber = model.IDNumber
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCustomer", new { id = customer.Id }, customer);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (string.IsNullOrEmpty(loginDto.Password))
            return BadRequest(new { message = "Password is required" });

        var customer = await _context.Customers.FirstOrDefaultAsync(c =>
            c.FullName.ToLower().Trim() == loginDto.FullName.ToLower().Trim() &&
            c.AccountNumber.Trim() == loginDto.AccountNumber.Trim());

        if (customer == null)
            return Unauthorized(new { message = "Invalid credentials" });

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, customer.PasswordHash);

        if (!isPasswordValid)
            return Unauthorized(new { message = "Invalid credentials" });

        var response = new
        {
            customer = new
            {
                id = customer.Id,
                fullName = customer.FullName,
                accountNumber = customer.AccountNumber,
                role = "customer"
            },
            token = "mock-token" // Replace with JWT token in production
        };

        return Ok(response);
    }
        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            if (id != customer.Id)
            {
                return BadRequest();
            }

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Customer>> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return customer;
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }

    }
}
