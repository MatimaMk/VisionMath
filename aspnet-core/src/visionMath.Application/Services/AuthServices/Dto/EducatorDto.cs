using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using visionMath.Students.Dto;

namespace visionMath.Services.PersonServices.Dtos
{
    public class CreateEducatorDto
    {
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        [StringLength(32)]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [Required]
        [StringLength(100)]
        public string HighestQualification { get; set; }

        [Range(0, 50)]
        public int YearsOfMathTeaching { get; set; }

        [StringLength(500)]
        public string Biography { get; set; }
    }

    public class EducatorResponseDto : EntityDto<Guid>
    {
        public long UserId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string HighestQualification { get; set; }
        public int YearsOfMathTeaching { get; set; }
        public string Biography { get; set; }
        public List<StudentDto> Students { get; set; }
    }

    public class UpdateEducatorDto : EntityDto<Guid>
    {
        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string Surname { get; set; }

        [EmailAddress]
        public string EmailAddress { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }

        [StringLength(32)]
        public string UserName { get; set; }

        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [StringLength(100)]
        public string HighestQualification { get; set; }

        [Range(0, 50)]
        public int? YearsOfMathTeaching { get; set; }

        [StringLength(500)]
        public string Biography { get; set; }
    }
}