using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using visionMath.Services.TestAppServices.Dtos;

namespace visionMath.Services.TestAppServices
{
    public interface ITestAppService : IAsyncCrudAppService<TestDto, Guid, PagedTestResultRequestDto, CreateTestDto, UpdateTestDto>
    {
        Task<TestWithQuestionsDto> GetTestWithQuestionsAsync(EntityDto<Guid> input);
        Task<SubmitTestResultDto> SubmitTestAnswersAsync(SubmitTestAnswersDto input);
    }
}