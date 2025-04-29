using Abp.Zero.EntityFrameworkCore;
using visionMath.Authorization.Roles;
using visionMath.Authorization.Users;
using visionMath.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace visionMath.EntityFrameworkCore;

public class visionMathDbContext : AbpZeroDbContext<Tenant, Role, User, visionMathDbContext>
{
    /* Define a DbSet for each entity of the application */

    public visionMathDbContext(DbContextOptions<visionMathDbContext> options)
        : base(options)
    {
    }
}
