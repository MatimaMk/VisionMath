using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using visionMath.Authorization.Roles;
using visionMath.Authorization.Users;
using visionMath.Domain.Resources;
using visionMath.MultiTenancy;

namespace visionMath.EntityFrameworkCore;

public class visionMathDbContext : AbpZeroDbContext<Tenant, Role, User, visionMathDbContext>
{
    /* Define a DbSet for each entity of the application */
    public DbSet<Topic> Topics { get; set; }

    public visionMathDbContext(DbContextOptions<visionMathDbContext> options)
        : base(options)
    {
    }
}
