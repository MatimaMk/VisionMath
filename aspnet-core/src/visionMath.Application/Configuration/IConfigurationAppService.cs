using visionMath.Configuration.Dto;
using System.Threading.Tasks;

namespace visionMath.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
