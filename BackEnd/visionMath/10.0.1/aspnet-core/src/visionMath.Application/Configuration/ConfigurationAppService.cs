using Abp.Authorization;
using Abp.Runtime.Session;
using visionMath.Configuration.Dto;
using System.Threading.Tasks;

namespace visionMath.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : visionMathAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
