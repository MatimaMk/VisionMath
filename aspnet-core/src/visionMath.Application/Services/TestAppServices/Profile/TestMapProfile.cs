using AutoMapper;
using visionMath.Domain.ProgressResources;
using visionMath.Services.TestAppServices.Dtos;

namespace visionMath.Services.TestAppServices.Mapping
{
    public class TestMapProfile : Profile
    {
        public TestMapProfile()
        {
            // Test mapping
            CreateMap<Test, TestDto>();
            CreateMap<Test, TestWithQuestionsDto>();
            CreateMap<CreateTestDto, Test>();
            CreateMap<UpdateTestDto, Test>();

            // Question mapping
            CreateMap<Question, QuestionDto>();
            CreateMap<Question, QuestionWithOptionsDto>();
            CreateMap<CreateQuestionDto, Question>();
            CreateMap<UpdateQuestionDto, Question>();

            // QuestionOption mapping
            CreateMap<QuestionOption, QuestionOptionDto>();
            CreateMap<CreateQuestionOptionDto, QuestionOption>();
            CreateMap<UpdateQuestionOptionDto, QuestionOption>();
        }
    }
}