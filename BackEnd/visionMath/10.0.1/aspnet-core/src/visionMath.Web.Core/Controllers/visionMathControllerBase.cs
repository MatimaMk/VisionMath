using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace visionMath.Controllers
{
    public abstract class visionMathControllerBase : AbpController
    {
        protected visionMathControllerBase()
        {
            LocalizationSourceName = visionMathConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
