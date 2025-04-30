using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace visionMath.EntityFrameworkCore;

public static class visionMathDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<visionMathDbContext> builder, string connectionString)
    {
        // builder.UseSqlServer(connectionString);
        builder.UseNpgsql(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<visionMathDbContext> builder, DbConnection connection)
    {
       // builder.UseSqlServer(connection);
        builder.UseNpgsql(connection);
    }
}
