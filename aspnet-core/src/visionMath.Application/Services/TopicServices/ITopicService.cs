using System;
using Abp.Application.Services;
using visionMath.Services.TopicServices.Dto;

namespace visionMath.Services.TopicServices
{
    public interface ITopicService : IAsyncCrudAppService<TopicDto,Guid>
    {

    }
}
