using System.Linq;
using System;
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Force all DateTime and DateTime? to be treated as UTC
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties()
                .Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?)))
            {
                property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(
                    v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                ));
            }
        }
    }
}
