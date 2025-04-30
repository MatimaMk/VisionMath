using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using visionMath.EntityFrameworkCore;
using visionMath.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace visionMath.Web.Tests;

[DependsOn(
    typeof(visionMathWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class visionMathWebTestModule : AbpModule
{
    public visionMathWebTestModule(visionMathEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(visionMathWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(visionMathWebMvcModule).Assembly);
    }
}