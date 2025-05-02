using System;
using System.Collections.Generic;
using Abp.Domain.Entities.Auditing;
using visionMath.Domain.Persons;

namespace visionMath.Domain.ProgressResources
{
    public class Progress: FullAuditedEntity<Guid>
    {
        public Guid StudentId { get; set; }
        public Student Student { get; set; }
        public Guid? TestId { get; set; }
        public Test? Test { get; set; }
        public int CompletionPercentage { get; set; }
        public double averagePercentage { get; set; }
        public bool Passed { get; set; }
        public TimeSpan TotalTimeSpent { get; set; }
        public virtual ICollection<Test> Tests { get; set; }


    }
}
