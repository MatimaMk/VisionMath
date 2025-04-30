using System;
using System.Collections.Generic;
using Abp.Domain.Entities.Auditing;

namespace visionMath.Domain.Resources
{
    public class Topic : FullAuditedEntity<Guid>
    {
        public string TopicTittle { get; set; }
        public string Description { get; set; }
        
        public TimeSpan EstimatedTime { get; set; }
        public virtual ReflistTopicDiffStatus? DifficultLevel { get; set; }

        public virtual ICollection<Content> Contents  { get; set; }

}
}
