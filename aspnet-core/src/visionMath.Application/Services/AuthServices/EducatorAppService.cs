using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using visionMath.Domain.Persons;
using visionMath.Services.PersonServices.Dtos;
using visionMath.Students.Dto;

namespace visionMath.Services.PersonServices
{
    public class EducatorAppService : AsyncCrudAppService<Educator, EducatorResponseDto, Guid, PagedAndSortedResultRequestDto, EducatorRequestDto, EducatorResponseDto>, IEducatorAppService
    {
        private readonly EducatorManager _educatorManager;
        private readonly IMapper _mapper;
        private readonly IRepository<Educator, Guid> _repository;

        public EducatorAppService(IRepository<Educator, Guid> repository, EducatorManager educatorManager, IMapper mapper) : base(repository)
        {
            _educatorManager = educatorManager;
            _repository = repository;
            _mapper = mapper;
        }

        public override async Task<EducatorResponseDto> CreateAsync(EducatorRequestDto input)
        {
            var educator = await _educatorManager.CreateEducatorAsync(
                input.FirstName,
                input.Surname,
                input.EmailAddress,
                input.PhoneNumber,
                input.UserName,
                input.Password,
                input.HighestQualification,
                input.YearsOfMathTeaching,
                input.Biography
            );

            return _mapper.Map<EducatorResponseDto>(educator);
        }

        public override async Task<EducatorResponseDto> GetAsync(EntityDto<Guid> input)
        {
            var educator = await _educatorManager.GetEducatorByIdWithDetailsAsync(input.Id);
            if (educator == null)
            {
                throw new UserFriendlyException("Educator not found");
            }

            return _mapper.Map<EducatorResponseDto>(educator);
        }

        public override async Task<PagedResultDto<EducatorResponseDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = _educatorManager.GetAllEducatorsAsync();
            var totalCount = await query.CountAsync();
            var educators = await query
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            return new PagedResultDto<EducatorResponseDto>(
                totalCount,
                _mapper.Map<List<EducatorResponseDto>>(educators)
            );
        }

        public async Task<EducatorResponseDto> GetCurrentEducatorAsync(long userId)
        {
            var educator = await _educatorManager.GetEducatorByUserIdAsync(userId);
            return _mapper.Map<Educator, EducatorResponseDto>(educator);
        }

        public async Task<List<StudentDto>> GetEducatorStudentsAsync(Guid educatorId)
        {
            var students = await _educatorManager.GetEducatorStudentsAsync(educatorId);
            return _mapper.Map<List<StudentDto>>(students);
        }

        public async Task<EducatorResponseDto> UpdateEducatorAsync(UpdateEducatorDto input)
        {
            var educator = await _repository.GetAsync(input.Id);
            if (educator == null)
                throw new UserFriendlyException("Educator not found");

            var updatedEducator = await _educatorManager.UpdateEducatorAsync(
                input.Id,
                input.FirstName,
                input.Surname,
                input.EmailAddress,
                input.PhoneNumber,
                input.UserName,
                input.Password,
                input.HighestQualification,
                input.YearsOfMathTeaching,
                input.Biography
            );

            return _mapper.Map<EducatorResponseDto>(updatedEducator);
        }

        public async Task AssignStudentToEducatorAsync(StudentEducatorAssignmentDto input)
        {
            await _educatorManager.AssignStudentToEducatorAsync(input.StudentId, input.EducatorId);
        }

        public async Task UnassignStudentFromEducatorAsync(StudentEducatorAssignmentDto input)
        {
            await _educatorManager.UnassignStudentFromEducatorAsync(input.StudentId, input.EducatorId);
        }

        public async Task ReassignStudentsAsync(EducatorReassignmentDto input)
        {
            await _educatorManager.ReassignStudentsAsync(input.FromEducatorId, input.ToEducatorId);
        }

        public async Task<bool> DeleteEducatorAsync(EntityDto<Guid> input)
        {
            return await _educatorManager.DeleteEducatorAsync(input.Id);
        }
    }
}