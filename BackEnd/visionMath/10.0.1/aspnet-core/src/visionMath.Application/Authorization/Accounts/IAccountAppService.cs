using Abp.Application.Services;
using visionMath.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace visionMath.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
