using Abp.Application.Services;
using visionMath.MultiTenancy.Dto;

namespace visionMath.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

