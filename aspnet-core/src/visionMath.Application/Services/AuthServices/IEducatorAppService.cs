using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using visionMath.Services.PersonServices.Dtos;
using visionMath.Students.Dto;

namespace visionMath.Services.PersonServices
{
    public interface IEducatorAppService : IAsyncCrudAppService<
        EducatorResponseDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateEducatorDto,
        UpdateEducatorDto>
    {
        Task<ListResultDto<StudentDto>> GetEducatorStudents(Guid educatorId);
        Task AssignStudentsToEducator(Guid educatorId, List<Guid> studentIds);
    }
}