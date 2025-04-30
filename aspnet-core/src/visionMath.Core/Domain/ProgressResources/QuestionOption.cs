using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities.Auditing;
using visionMath.Domain.Resources;

namespace visionMath.Domain.ProgressResources
{
    public class QuestionOption: FullAuditedEntity<Guid>
    {

        [Required]
        public string OptionText { get; set; }

        public  bool IsCorrect { get; set; }

        public  int OrderNumber { get; set; }
        public  string? Explanation { get; set; }

        public virtual ICollection<Answer> SelectedAnswers { get; set; }


    }
}
