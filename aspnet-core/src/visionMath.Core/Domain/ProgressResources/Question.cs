using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities.Auditing;
using visionMath.Domain.Resources;

namespace visionMath.Domain.ProgressResources
{
    public class Question : FullAuditedEntity<Guid>
    {
        [Required]
        public  string QuestionText { get; set; }

        [Required]
        public virtual ReflistQuestionFomart? QuestionType { get; set; }

        public  int QuestionPoints { get; set; }

        public  string SolutionExplanation { get; set; }  // more of wuestion instructions

        public virtual ICollection<QuestionOption> QuestionOptions { get; set; }


    }
}
