using System;
using Abp.Domain.Entities.Auditing;

namespace visionMath.Domain.ProgressResources
{
    public class Answer : FullAuditedEntity<Guid>
    {
        public  string TextAnswer { get; set; }

        public  int? NumericAnswer { get; set; }

        public bool IsCorrect { get; set; }

        public int PointsAwarded { get; set; }


    }
}
