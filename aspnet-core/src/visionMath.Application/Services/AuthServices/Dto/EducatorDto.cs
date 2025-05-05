using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using visionMath.Students.Dto;

namespace visionMath.Services.PersonServices.Dtos
{
    public class EducatorRequestDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; }

        public string PhoneNumber { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        public string HighestQualification { get; set; }

        [Required]
        [Range(0, 100)]
        public int YearsOfMathTeaching { get; set; }

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
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string HighestQualification { get; set; }
        public int? YearsOfMathTeaching { get; set; }
        public string Biography { get; set; }
    }

    public class StudentEducatorAssignmentDto
    {
        [Required]
        public Guid StudentId { get; set; }

        [Required]
        public Guid EducatorId { get; set; }
    }

    public class EducatorReassignmentDto
    {
        [Required]
        public Guid FromEducatorId { get; set; }

        [Required]
        public Guid ToEducatorId { get; set; }
    }
}