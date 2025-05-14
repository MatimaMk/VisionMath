using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using visionMath.Domain.ProgressResources;
using visionMath.Services.TestAppServices.Dtos;

namespace visionMath.Services.TestAppServices
{
    public class TestAppService : AsyncCrudAppService<Test, TestDto, Guid, PagedTestResultRequestDto, CreateTestDto, UpdateTestDto>, ITestAppService
    {
        private readonly IRepository<Question, Guid> _questionRepository;
        private readonly IRepository<QuestionOption, Guid> _questionOptionRepository;
        private readonly IRepository<Answer, Guid> _answerRepository;

        public TestAppService(
            IRepository<Test, Guid> repository,
            IRepository<Question, Guid> questionRepository,
            IRepository<QuestionOption, Guid> questionOptionRepository,
            IRepository<Answer, Guid> answerRepository)
            : base(repository)
        {
            _questionRepository = questionRepository;
            _questionOptionRepository = questionOptionRepository;
            _answerRepository = answerRepository;
        }

        public override async Task<TestDto> CreateAsync(CreateTestDto input)
        {
            // Create the test
            var test = ObjectMapper.Map<Test>(input);
            test.Id = Guid.NewGuid();
            test.Questions = new List<Question>();

  
            if (input.Questions != null && input.Questions.Any())
            {
                foreach (var questionDto in input.Questions)
                {
                    var question = ObjectMapper.Map<Question>(questionDto);
                    question.Id = Guid.NewGuid();
                    question.QuestionOptions = new List<QuestionOption>();

                    // Create question options if they are provided
                    if (questionDto.QuestionOptions != null && questionDto.QuestionOptions.Any())
                    {
                        foreach (var optionDto in questionDto.QuestionOptions)
                        {
                            var option = ObjectMapper.Map<QuestionOption>(optionDto);
                            option.Id = Guid.NewGuid();
                            question.QuestionOptions.Add(option);
                        }
                    }

                    test.Questions.Add(question);
                }
            }

            await Repository.InsertAsync(test);
            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<TestDto>(test);
        }
        public override async Task<TestDto> UpdateAsync(UpdateTestDto input)
        {
            // Get the existing test
            var test = await Repository.GetAsync(input.Id);
            if (test == null)
            {
                throw new UserFriendlyException("Test not found!");
            }

            // Update basic test properties
            ObjectMapper.Map(input, test);

            // Update existing questions, add new ones, remove deleted ones
            if (input.Questions != null)
            {
                // Get existing questions for this test
                var existingQuestions = await _questionRepository.GetAllListAsync();
                var testQuestions = existingQuestions.Where(q => test.Questions.Any(tq => tq.Id == q.Id)).ToList();

                // New questions to add
                var newQuestions = input.Questions
                    .Where(q => q.Id == Guid.Empty || !testQuestions.Any(tq => tq.Id == q.Id))
                    .ToList();

                // Questions to update
                var questionsToUpdate = input.Questions
                    .Where(q => q.Id != Guid.Empty && testQuestions.Any(tq => tq.Id == q.Id))
                    .ToList();

                // Questions to remove
                var questionsToRemove = testQuestions
                    .Where(q => !input.Questions.Any(iq => iq.Id == q.Id))
                    .ToList();

                // Remove questions
                foreach (var questionToRemove in questionsToRemove)
                {
                    await _questionRepository.DeleteAsync(questionToRemove);
                }

                // Update questions
                foreach (var questionDto in questionsToUpdate)
                {
                    var existingQuestion = testQuestions.First(q => q.Id == questionDto.Id);
                    ObjectMapper.Map(questionDto, existingQuestion);

                    // Update options
                    if (questionDto.QuestionOptions != null)
                    {
                        // Get existing options
                        var existingOptions = await _questionOptionRepository.GetAllListAsync();
                        var questionOptions = existingOptions.Where(o => existingQuestion.QuestionOptions.Any(qo => qo.Id == o.Id)).ToList();

                        // New options to add
                        var newOptions = questionDto.QuestionOptions
                            .Where(o => o.Id == Guid.Empty || !questionOptions.Any(qo => qo.Id == o.Id))
                            .ToList();

                        // Options to update
                        var optionsToUpdate = questionDto.QuestionOptions
                            .Where(o => o.Id != Guid.Empty && questionOptions.Any(qo => qo.Id == o.Id))
                            .ToList();

                        // Options to remove
                        var optionsToRemove = questionOptions
                            .Where(o => !questionDto.QuestionOptions.Any(io => io.Id == o.Id))
                            .ToList();

                        // Remove options
                        foreach (var optionToRemove in optionsToRemove)
                        {
                            await _questionOptionRepository.DeleteAsync(optionToRemove);
                        }

                        // Update options
                        foreach (var optionDto in optionsToUpdate)
                        {
                            var existingOption = questionOptions.First(o => o.Id == optionDto.Id);
                            ObjectMapper.Map(optionDto, existingOption);
                            await _questionOptionRepository.UpdateAsync(existingOption);
                        }

                        // Add new options
                        foreach (var newOptionDto in newOptions)
                        {
                            var newOption = ObjectMapper.Map<QuestionOption>(newOptionDto);
                            if (newOption.Id == Guid.Empty)
                            {
                                newOption.Id = Guid.NewGuid();
                            }
                            existingQuestion.QuestionOptions.Add(newOption);
                            await _questionOptionRepository.InsertAsync(newOption);
                        }
                    }

                    await _questionRepository.UpdateAsync(existingQuestion);
                }

                // Add new questions
                foreach (var newQuestionDto in newQuestions)
                {
                    var newQuestion = ObjectMapper.Map<Question>(newQuestionDto);
                    if (newQuestion.Id == Guid.Empty)
                    {
                        newQuestion.Id = Guid.NewGuid();
                    }
                    newQuestion.QuestionOptions = new List<QuestionOption>();

                    // Add options for new question
                    if (newQuestionDto.QuestionOptions != null)
                    {
                        foreach (var optionDto in newQuestionDto.QuestionOptions)
                        {
                            var newOption = ObjectMapper.Map<QuestionOption>(optionDto);
                            if (newOption.Id == Guid.Empty)
                            {
                                newOption.Id = Guid.NewGuid();
                            }
                            newQuestion.QuestionOptions.Add(newOption);
                            await _questionOptionRepository.InsertAsync(newOption);
                        }
                    }

                    test.Questions.Add(newQuestion);
                    await _questionRepository.InsertAsync(newQuestion);
                }
            }

            await Repository.UpdateAsync(test);
            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<TestDto>(test);
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            var test = await Repository.GetAsync(input.Id);
            if (test == null)
            {
                throw new UserFriendlyException("Test not found!");
            }

            // Delete related questions and their options
            foreach (var question in test.Questions)
            {
                // Delete question options
                foreach (var option in question.QuestionOptions)
                {
                    await _questionOptionRepository.DeleteAsync(option);
                }

                await _questionRepository.DeleteAsync(question);
            }

            await Repository.DeleteAsync(test);
        }

        public override async Task<TestDto> GetAsync(EntityDto<Guid> input)
        {
            var test = await Repository.GetAllIncluding(t => t.Questions)
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            if (test == null)
            {
                throw new UserFriendlyException("Test not found!");
            }

            // Loading questions with their options
            foreach (var question in test.Questions)
            {
                await _questionRepository.EnsureCollectionLoadedAsync(question, q => q.QuestionOptions);
            }

            return ObjectMapper.Map<TestDto>(test);
        }

        public async Task<TestWithQuestionsDto> GetTestWithQuestionsAsync(EntityDto<Guid> input)
        {
            var test = await Repository.GetAllIncluding(t => t.Questions)
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            if (test == null)
            {
                throw new UserFriendlyException("Test not found!");
            }

            // Loading questions with their options
            foreach (var question in test.Questions)
            {
                await _questionRepository.EnsureCollectionLoadedAsync(question, q => q.QuestionOptions);
            }

            return ObjectMapper.Map<TestWithQuestionsDto>(test);
        }

        public async Task<SubmitTestResultDto> SubmitTestAnswersAsync(SubmitTestAnswersDto input)
        {
            var test = await Repository.GetAllIncluding(t => t.Questions)
                .Where(t => t.Id == input.TestId)
                .FirstOrDefaultAsync();

            if (test == null)
            {
                throw new UserFriendlyException("Test not found!");
            }

            // Load questions with their options
            foreach (var question in test.Questions)
            {
                await _questionRepository.EnsureCollectionLoadedAsync(question, q => q.QuestionOptions);
            }

            // Increment test attempts
            test.Attempts++;
            await Repository.UpdateAsync(test);

            // Process answers and calculate score
            int totalPoints = test.Questions.Sum(q => q.QuestionPoints);
            int earnedPoints = 0;
            var answers = new List<Answer>();

            foreach (var submittedAnswer in input.Answers)
            {
                var question = test.Questions.FirstOrDefault(q => q.Id == submittedAnswer.QuestionId);
                if (question == null) continue;

                var answer = new Answer
                {
                    Id = Guid.NewGuid(),
                    CreationTime = DateTime.Now
                };

                // Process answer based on question type
                if (question.QuestionType == ReflistQuestionFomart.MultipleChoice ||
                    question.QuestionType == ReflistQuestionFomart.TrueFalse)
                {
                    // Find selected option
                    var selectedOption = question.QuestionOptions.FirstOrDefault(o => o.Id == submittedAnswer.SelectedOptionId);
                    if (selectedOption != null)
                    {
                        answer.IsCorrect = selectedOption.IsCorrect;
                        if (answer.IsCorrect)
                        {
                            answer.PointsAwarded = question.QuestionPoints;
                            earnedPoints += question.QuestionPoints;
                        }

                        // Link answer to option
                        selectedOption.SelectedAnswers ??= new List<Answer>();
                        selectedOption.SelectedAnswers.Add(answer);
                        await _questionOptionRepository.UpdateAsync(selectedOption);
                    }
                }
                else if (question.QuestionType == ReflistQuestionFomart.FillInTheBlank)
                {
                    answer.TextAnswer = submittedAnswer.TextAnswer;

                    ////Mk:  For text answers, a need for manual grading or exact match  
                   
                    var correctOption = question.QuestionOptions.FirstOrDefault(o => o.IsCorrect);
                    if (correctOption != null && answer.TextAnswer?.Trim().ToLower() == correctOption.OptionText?.Trim().ToLower())
                    {
                        answer.IsCorrect = true;
                        answer.PointsAwarded = question.QuestionPoints;
                        earnedPoints += question.QuestionPoints;
                    }
                }
                else if (question.QuestionType == ReflistQuestionFomart.Numeric)
                {
                    answer.NumericAnswer = submittedAnswer.NumericAnswer;

                    // For numeric answers
                    var correctOption = question.QuestionOptions.FirstOrDefault(o => o.IsCorrect);
                    if (correctOption != null && int.TryParse(correctOption.OptionText, out int correctValue) &&
                        answer.NumericAnswer == correctValue)
                    {
                        answer.IsCorrect = true;
                        answer.PointsAwarded = question.QuestionPoints;
                        earnedPoints += question.QuestionPoints;
                    }
                }

                answers.Add(answer);
                await _answerRepository.InsertAsync(answer);
            }

            // Calculate percentage
            double percentage = totalPoints > 0 ? (double)earnedPoints / totalPoints * 100 : 0;
            bool passed = percentage >= test.PassingPercentage;

            await CurrentUnitOfWork.SaveChangesAsync();

            return new SubmitTestResultDto
            {
                TestId = test.Id,
                EarnedPoints = earnedPoints,
                TotalPoints = totalPoints,
                Percentage = percentage,
                Passed = passed
            };
        }
    }
}