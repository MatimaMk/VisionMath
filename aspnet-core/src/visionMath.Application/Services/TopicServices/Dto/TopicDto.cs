using System;
using Abp.Application.Services.Dto;
using AutoMapper;
using visionMath.Domain.Resources;

namespace visionMath.Services.TopicServices.Dto
{
    [AutoMap(typeof(Topic))]
    public class TopicDto : EntityDto<Guid>
    {
        public string TopicTittle { get; set; }
        public string Description { get; set; }

        public TimeSpan EstimatedTime { get; set; }
        public virtual ReflistTopicDiffStatus? DifficultLevel { get; set; }
    }
}
