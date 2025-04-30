using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using visionMath.Configuration;
using visionMath.EntityFrameworkCore;
using visionMath.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace visionMath.Migrator;

[DependsOn(typeof(visionMathEntityFrameworkModule))]
public class visionMathMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public visionMathMigratorModule(visionMathEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(visionMathMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            visionMathConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(visionMathMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
