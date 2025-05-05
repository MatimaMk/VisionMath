using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using visionMath.Domain.Persons;
using visionMath.Services.PersonServices.Dtos;
using visionMath.Students.Dto;

namespace visionMath.Services.PersonServices
{
    public interface IEducatorAppService : IAsyncCrudAppService<EducatorResponseDto, Guid, PagedAndSortedResultRequestDto, EducatorRequestDto, EducatorResponseDto>
    {
        Task<EducatorResponseDto> GetCurrentEducatorAsync(long userId);
        Task<List<StudentDto>> GetEducatorStudentsAsync(Guid educatorId);
        Task<EducatorResponseDto> UpdateEducatorAsync(UpdateEducatorDto input);
        Task AssignStudentToEducatorAsync(StudentEducatorAssignmentDto input);
        Task UnassignStudentFromEducatorAsync(StudentEducatorAssignmentDto input);
        Task ReassignStudentsAsync(EducatorReassignmentDto input);
        Task<bool> DeleteEducatorAsync(EntityDto<Guid> input);
    }
}