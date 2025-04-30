using Abp.Application.Services;
using visionMath.Sessions.Dto;
using System.Threading.Tasks;

namespace visionMath.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
