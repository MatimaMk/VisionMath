using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using visionMath.Authorization.Users;
using visionMath.Domain.ProgressResources;

namespace visionMath.Domain.Persons
{
    public class Student : FullAuditedEntity<Guid>
    {
        [Required]
        public long UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        public string StudentNumber { get; set; }
        public string PhoneNumber { get; set; }  

        public DateTime DateOfBirth { get; set; }

        public virtual ICollection<Test>? Tests { get; set; } 
        public ICollection<Progress> ProgressRecords { get; set; }
        public Guid EducatorId { get; set; }
        public Educator Educator { get; set; }

    }
}
