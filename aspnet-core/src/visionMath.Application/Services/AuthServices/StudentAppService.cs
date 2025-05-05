using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using visionMath.Domain.Persons;
using visionMath.Services.AuthServices;
using visionMath.Students.Dto;

namespace visionMath.Students
{
    public class StudentAppService :
        AsyncCrudAppService<Student, StudentDto, Guid, GetAllStudentsInput, CreateStudentDto, UpdateStudentDto>,
        IStudentAppService
    {
        private readonly StudentManager _studentManager;

        public StudentAppService(
            IRepository<Student, Guid> repository,
            StudentManager studentManager)
            : base(repository)
        {
            _studentManager = studentManager;

            // Configure base class behavior
            LocalizationSourceName = "visionMath";
            GetPermissionName = "Pages.Students.View";
            GetAllPermissionName = "Pages.Students.View";
            CreatePermissionName = "Pages.Students.Create";
            UpdatePermissionName = "Pages.Students.Edit";
            DeletePermissionName = "Pages.Students.Delete";
        }

        public async Task<StudentDto> GetStudentByUserIdAsync(EntityDto<long> input)
        {
            var student = await _studentManager.GetStudentByUserIdAsync(input.Id);
            return MapToEntityDto(student);
        }

        public async Task<ListResultDto<StudentDto>> GetStudentsByEducatorIdAsync(EntityDto<Guid> input)
        {
            var students = await _studentManager.GetStudentsByEducatorIdAsync(input.Id);
            return new ListResultDto<StudentDto>(
                ObjectMapper.Map<List<StudentDto>>(students)
            );
        }

        protected override IQueryable<Student> CreateFilteredQuery(GetAllStudentsInput input)
        {
            var query = _studentManager.GetAllStudentsAsync();

            if (!string.IsNullOrEmpty(input.Filter))
            {
                var filter = input.Filter.ToLower();
                query = query.Where(s =>
                    s.User.Name.ToLower().Contains(filter) ||
                    s.User.Surname.ToLower().Contains(filter) ||
                    s.User.EmailAddress.ToLower().Contains(filter) ||
                    s.StudentNumber.ToLower().Contains(filter)
                );
            }

            if (input.EducatorId.HasValue)
            {
                query = query.Where(s => s.EducatorId == input.EducatorId.Value);
            }

            return query;
        }

        public override async Task<StudentDto> CreateAsync(CreateStudentDto input)
        {
            // Use StudentManager to handle the creation logic
            var student = await _studentManager.CreateStudentAsync(
                input.FirstName,
                input.Surname,
                input.EmailAddress,
                input.PhoneNumber,
                input.Username,
                input.Password,
                input.DateOfBirth,
                input.StudentNumber,
                input.EducatorId
            );

            return MapToEntityDto(student);
        }

        public override async Task<StudentDto> UpdateAsync(UpdateStudentDto input)
        {
            // Use StudentManager to handle the update logic
            var student = await _studentManager.UpdateStudentAsync(
                input.Id,
                input.FirstName,
                input.Surname,
                input.EmailAddress,
                input.PhoneNumber,
                input.Username,
                input.Password,
                input.StudentNumber,
                input.EducatorId
            );

            return MapToEntityDto(student);
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            // Use StudentManager to handle the deletion logic
            await _studentManager.DeleteStudentAsync(input.Id);
        }

        public override async Task<StudentDto> GetAsync(EntityDto<Guid> input)
        {
            // Use StudentManager to get student with detailed information
            var student = await _studentManager.GetStudentByIdWithDetailsAsync(input.Id);
            return MapToEntityDto(student);
        }
    }
}