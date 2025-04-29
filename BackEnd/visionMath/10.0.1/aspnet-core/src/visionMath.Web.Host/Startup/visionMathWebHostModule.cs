using Abp.Modules;
using Abp.Reflection.Extensions;
using visionMath.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace visionMath.Web.Host.Startup
{
    [DependsOn(
       typeof(visionMathWebCoreModule))]
    public class visionMathWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public visionMathWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(visionMathWebHostModule).GetAssembly());
        }
    }
}
