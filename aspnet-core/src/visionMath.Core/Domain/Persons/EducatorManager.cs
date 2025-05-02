using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using visionMath.Authorization.Users;

namespace visionMath.Domain.Persons
{
    public class EducatorManager : DomainService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<Educator, Guid> _educatorRepository;
        private readonly IRepository<Student, Guid> _studentRepository;

        public EducatorManager(
            UserManager userManager,
            IRepository<Educator, Guid> educatorRepository,
            IRepository<Student, Guid> studentRepository)
        {
            _userManager = userManager;
            _educatorRepository = educatorRepository;
            _studentRepository = studentRepository;
        }

        // Get students assigned to a specific educator
        public async Task<IList<Student>> GetEducatorStudentsAsync(Guid educatorId)
        {
            // First check if educator exists
            var educator = await _educatorRepository.GetAsync(educatorId);
            if (educator == null)
            {
                throw new UserFriendlyException("Educator not found");
            }

            // Retrieve all students assigned to this educator
            var query = await _studentRepository.GetAllIncludingAsync(s => s.User);
            return await query.Where(s => s.EducatorId == educatorId).ToListAsync();
        }

        // Method to assign a student to an educator
        public async Task AssignStudentToEducatorAsync(Guid studentId, Guid educatorId)
        {
            // Verify both entities exist
            var student = await _studentRepository.GetAsync(studentId);
            if (student == null)
            {
                throw new UserFriendlyException("Student not found");
            }

            var educator = await _educatorRepository.GetAsync(educatorId);
            if (educator == null)
            {
                throw new UserFriendlyException("Educator not found");
            }

            // Update the student's educator
            student.EducatorId = educatorId;
            await _studentRepository.UpdateAsync(student);
        }

        // Method to remove a student from an educator's responsibility
        public async Task UnassignStudentFromEducatorAsync(Guid studentId, Guid educatorId)
        {
            var student = await _studentRepository.GetAsync(studentId);
            if (student == null)
            {
                throw new UserFriendlyException("Student not found");
            }

            // Verify student is assigned to this educator
            if (student.EducatorId != educatorId)
            {
                throw new UserFriendlyException("Student is not assigned to this educator");
            }

            // Set to default value (assuming you want to allow null EducatorId)
            student.EducatorId = Guid.Empty; 
            await _studentRepository.UpdateAsync(student);
        }

        // Method to reassign students from one educator to another
        public async Task ReassignStudentsAsync(Guid fromEducatorId, Guid toEducatorId)
        {
            // Verify both educators exist
            var sourceEducator = await _educatorRepository.GetAsync(fromEducatorId);
            if (sourceEducator == null)
            {
                throw new UserFriendlyException("Source educator not found");
            }

            var targetEducator = await _educatorRepository.GetAsync(toEducatorId);
            if (targetEducator == null)
            {
                throw new UserFriendlyException("Target educator not found");
            }
            var students = await GetEducatorStudentsAsync(fromEducatorId);

            // Reassign each student
            foreach (var student in students)
            {
                student.EducatorId = toEducatorId;
                await _studentRepository.UpdateAsync(student);
            }
        }

    }
}
