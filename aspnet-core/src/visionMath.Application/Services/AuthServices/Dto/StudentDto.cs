using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using visionMath.Domain.Persons;
using Abp.Runtime.Validation;

namespace visionMath.Students.Dto
{
    [AutoMapFrom(typeof(Student))]
    public class StudentDto : EntityDto<Guid>
    {
        public long UserId { get; set; }

        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string FullName => $"{FirstName} {Surname}";

        public string EmailAddress { get; set; }

        public string Username { get; set; }

        public string PhoneNumber { get; set; }

        public string StudentNumber { get; set; }

        public DateTime DateOfBirth { get; set; }

        public int Age => DateTime.Today.Year - DateOfBirth.Year -
                          (DateTime.Today.DayOfYear < DateOfBirth.DayOfYear ? 1 : 0);

        public Guid EducatorId { get; set; }

        public string EducatorFullName { get; set; }
    }

    public class GetAllStudentsInput : PagedAndSortedResultRequestDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public Guid? EducatorId { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "User.Surname,User.Name";
            }
        }
    }

    [AutoMapTo(typeof(Student))]
    public class CreateStudentDto
    {
        [Required]
        [StringLength(64)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(64)]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string EmailAddress { get; set; }

        [Required]
        [StringLength(32)]
        public string Username { get; set; }

        [Required]
        [StringLength(32)]
        public string Password { get; set; }

        [Phone]
        [StringLength(32)]
        public string PhoneNumber { get; set; }

        [Required]
        [StringLength(32)]
        public string StudentNumber { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public Guid EducatorId { get; set; }
    }

    [AutoMapTo(typeof(Student))]
    public class UpdateStudentDto : EntityDto<Guid>
    {
        [StringLength(64)]
        public string FirstName { get; set; }

        [StringLength(64)]
        public string Surname { get; set; }

        [EmailAddress]
        [StringLength(256)]
        public string EmailAddress { get; set; }

        [StringLength(32)]
        public string Username { get; set; }

        [StringLength(32)]
        public string Password { get; set; }

        [Phone]
        [StringLength(32)]
        public string PhoneNumber { get; set; }

        [StringLength(32)]
        public string StudentNumber { get; set; }

        public Guid? EducatorId { get; set; }
    }
}