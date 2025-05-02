using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using visionMath.Authorization.Users;

namespace visionMath.Domain.Persons
{
    public class Educator : FullAuditedEntity<Guid>
    {
        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public string HighestQualification { get; set; }
        public int YearsOfMathTeaching { get; set; }
        public string Biography { get; set; }

        public ICollection<Student> Students { get; set; }

    }
}
