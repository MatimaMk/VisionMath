using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using visionMath.Authorization;

namespace visionMath;

[DependsOn(
    typeof(visionMathCoreModule),
    typeof(AbpAutoMapperModule))]
public class visionMathApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<visionMathAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(visionMathApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
