using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities.Auditing;
using visionMath.Domain.Resources;

namespace visionMath.Domain.ProgressResources
{
    public class Test : FullAuditedEntity<Guid>
    {
        [Required]
        [StringLength(2000)]
        public  string Title { get; set; }

        [StringLength(1000)]
        public  string Description { get; set; }

        [Required]
        public  DateTime TimeLimitMinutes { get; set; }

        public  ReflistDifficultyLevel? DifficultyLevel { get; set; } // ENUM

        [Required]
        public  int  PassingPercentage { get; set; }

        public  string? Instructions { get; set; }

        public virtual ICollection<Question> Questions { get; set; }
    }

}

