using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using visionMath.Students.Dto;

namespace visionMath.Services.AuthServices
{
    public interface IStudentAppService :
        IAsyncCrudAppService<StudentDto, Guid, GetAllStudentsInput, CreateStudentDto, UpdateStudentDto>
    {
        Task<StudentDto> GetStudentByUserIdAsync(EntityDto<long> input);

        Task<ListResultDto<StudentDto>> GetStudentsByEducatorIdAsync(EntityDto<Guid> input);
    }
}