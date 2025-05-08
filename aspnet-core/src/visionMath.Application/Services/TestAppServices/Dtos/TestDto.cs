using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using visionMath.Domain.ProgressResources;

namespace visionMath.Services.TestAppServices.Dtos
{
    #region Test DTOs

    public class TestDto : EntityDto<Guid>, IEntityDto<Guid>
    {
        [Required]
        [StringLength(2000)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        public DateTime TimeLimitMinutes { get; set; }

        public ReflistDifficultyLevel? DifficultyLevel { get; set; }

        [Required]
        public int PassingPercentage { get; set; }

        public string Instructions { get; set; }

        public int Attempts { get; set; }

        public List<QuestionDto> Questions { get; set; }
    }

    public class TestWithQuestionsDto : EntityDto<Guid>, IEntityDto<Guid>
    {
        [Required]
        [StringLength(2000)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        public DateTime TimeLimitMinutes { get; set; }

        public ReflistDifficultyLevel? DifficultyLevel { get; set; }

        [Required]
        public int PassingPercentage { get; set; }

        public string Instructions { get; set; }

        public int Attempts { get; set; }

        public List<QuestionWithOptionsDto> Questions { get; set; }
    }

    public class CreateTestDto
    {
        [Required]
        [StringLength(2000)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        public DateTime TimeLimitMinutes { get; set; }

        public ReflistDifficultyLevel? DifficultyLevel { get; set; }

        [Required]
        public int PassingPercentage { get; set; }

        public string Instructions { get; set; }

        public List<CreateQuestionDto> Questions { get; set; }
    }

    public class UpdateTestDto : EntityDto<Guid>, IEntityDto<Guid>
    {
        [Required]
        [StringLength(2000)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        public DateTime TimeLimitMinutes { get; set; }

        public ReflistDifficultyLevel? DifficultyLevel { get; set; }

        [Required]
        public int PassingPercentage { get; set; }

        public string Instructions { get; set; }

        public List<UpdateQuestionDto> Questions { get; set; }
    }

    public class PagedTestResultRequestDto : PagedResultRequestDto
    {
        public string Keyword { get; set; }
        public ReflistDifficultyLevel? DifficultyLevel { get; set; }
    }

    #endregion

    #region Question DTOs

    public class QuestionDto : EntityDto<Guid>, IEntityDto<Guid>
    {
        [Required]
        public string QuestionText { get; set; }

        [Required]
        public ReflistQuestionFomart? QuestionType { get; set; }

        public int QuestionPoints { get; set; }

        public string SolutionExplanation { get; set; }

        public List<QuestionOptionDto> QuestionOptions { get; set; }
    }

    public class QuestionWithOptionsDto : EntityDto<Guid>, IEntityDto<Guid>
    {
        [Required]
        public string QuestionText { get; set; }

        [Required]
        public ReflistQuestionFomart? QuestionType { get; set; }

        public int QuestionPoints { get; set; }

        public string SolutionExplanation { get; set; }

        public List<QuestionOptionDto> QuestionOptions { get; set; }
    }

    public class CreateQuestionDto
    {
        [Required]
        public string QuestionText { get; set; }

        [Required]
        public ReflistQuestionFomart? QuestionType { get; set; }

        public int QuestionPoints { get; set; }

        public string SolutionExplanation { get; set; }

        public List<CreateQuestionOptionDto> QuestionOptions { get; set; }
    }

    public class UpdateQuestionDto : EntityDto<Guid>, IEntityDto<Guid>
    {
        [Required]
        public string QuestionText { get; set; }

        [Required]
        public ReflistQuestionFomart? QuestionType { get; set; }

        public int QuestionPoints { get; set; }

        public string SolutionExplanation { get; set; }

        public List<UpdateQuestionOptionDto> QuestionOptions { get; set; }
    }

    #endregion

    #region QuestionOption DTOs

    public class QuestionOptionDto : EntityDto<Guid>, IEntityDto<Guid>
    {
        [Required]
        public string OptionText { get; set; }

        public bool IsCorrect { get; set; }

        public int OrderNumber { get; set; }

        public string Explanation { get; set; }
    }

    public class CreateQuestionOptionDto
    {
        [Required]
        public string OptionText { get; set; }

        public bool IsCorrect { get; set; }

        public int OrderNumber { get; set; }

        public string Explanation { get; set; }
    }

    public class UpdateQuestionOptionDto : EntityDto<Guid>, IEntityDto<Guid>
    {
        [Required]
        public string OptionText { get; set; }

        public bool IsCorrect { get; set; }

        public int OrderNumber { get; set; }

        public string Explanation { get; set; }
    }

    #endregion

    #region Answer DTOs

    public class SubmitTestAnswersDto
    {
        [Required]
        public Guid TestId { get; set; }

        public List<SubmitAnswerDto> Answers { get; set; }
    }

    public class SubmitAnswerDto
    {
        [Required]
        public Guid QuestionId { get; set; }

        // For multiple choice and single choice
        public Guid? SelectedOptionId { get; set; }

        // For text answer
        public string TextAnswer { get; set; }

        // For numeric answer
        public int? NumericAnswer { get; set; }
    }

    public class SubmitTestResultDto
    {
        public Guid TestId { get; set; }

        public int EarnedPoints { get; set; }

        public int TotalPoints { get; set; }

        public double Percentage { get; set; }

        public bool Passed { get; set; }
    }

    #endregion
}