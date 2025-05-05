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
    public class EducatorAppService : AsyncCrudAppService<
        Educator,
        EducatorResponseDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateEducatorDto,
        UpdateEducatorDto>,
        IEducatorAppService
    {
        private readonly EducatorManager _educatorManager;
        private readonly IRepository<Student, Guid> _studentRepository;

        public EducatorAppService(
            IRepository<Educator, Guid> repository,
            EducatorManager educatorManager,
            IRepository<Student, Guid> studentRepository)
            : base(repository)
        {
            _educatorManager = educatorManager;
            _studentRepository = studentRepository;
        }

        public override async Task<EducatorResponseDto> CreateAsync(CreateEducatorDto input)
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
                input.Biography);

            return ObjectMapper.Map<EducatorResponseDto>(educator);
        }

        public override async Task<EducatorResponseDto> GetAsync(EntityDto<Guid> input)
        {
            var educator = await _educatorManager.GetEducatorWithDetailsAsync(input.Id);
            return ObjectMapper.Map<EducatorResponseDto>(educator);
        }

        public override async Task<PagedResultDto<EducatorResponseDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = _educatorManager.GetAllEducatorsWithDetails();

            var totalCount = await query.CountAsync();
            var educators = await query
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            return new PagedResultDto<EducatorResponseDto>(
                totalCount,
                ObjectMapper.Map<List<EducatorResponseDto>>(educators)
            );
        }

        public async Task<ListResultDto<StudentDto>> GetEducatorStudents(Guid educatorId)
        {
            var students = await _studentRepository.GetAll()
                .Where(s => s.EducatorId == educatorId)
                .Include(s => s.User)
                .ToListAsync();

            return new ListResultDto<StudentDto>(
                ObjectMapper.Map<List<StudentDto>>(students)
            );
        }

        public async Task AssignStudentsToEducator(Guid educatorId, List<Guid> studentIds)
        {
            var educator = await _educatorManager.GetEducatorWithDetailsAsync(educatorId);
            var students = await _studentRepository.GetAll()
                .Where(s => studentIds.Contains(s.Id))
                .ToListAsync();

            foreach (var student in students)
            {
                student.EducatorId = educatorId;
                await _studentRepository.UpdateAsync(student);
            }
        }
    }
}