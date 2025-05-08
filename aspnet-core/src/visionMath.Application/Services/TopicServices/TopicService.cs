using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using visionMath.Domain.Resources;
using visionMath.Services.TopicServices.Dto;

namespace visionMath.Services.TopicServices
{
    public class TopicService : AsyncCrudAppService<Topic, TopicDto, Guid>, ITopicService
    {
        public TopicService(IRepository<Topic, Guid> repository) : base(repository)
        {
        }

        public override Task<TopicDto> UpdateAsync(TopicDto input)
        {
            return base.UpdateAsync(input);
        }
    }
}
