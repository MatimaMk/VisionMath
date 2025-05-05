using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<Educator> CreateEducatorAsync(
            string firstName,
            string surname,
            string emailAddress,
            string phoneNumber,
            string username,
            string password,
            string highestQualification,
            int yearsOfMathTeaching,
            string biography)
        {
            try
            {
                // Create user account
                var user = new User
                {
                    UserName = username,
                    Name = firstName,
                    Surname = surname,
                    EmailAddress = emailAddress,
                    PhoneNumber = phoneNumber,
                    IsActive = true
                };

                var result = await _userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                {
                    throw new UserFriendlyException("Failed to create user: " + string.Join(", ", result.Errors));
                }

                // Add to Educator role
                await _userManager.AddToRoleAsync(user, "EDUCATOR");

                // Create educator entity
                var educator = new Educator
                {
                    UserId = Convert.ToInt64(user.Id),
                    HighestQualification = highestQualification,
                    YearsOfMathTeaching = yearsOfMathTeaching,
                    Biography = biography,
                    Students = new List<Student>()
                };

                await _educatorRepository.InsertAsync(educator);

                return educator;
            }
            catch (Exception ex)
            {
                Logger.Error($"Error creating educator: {ex.Message}", ex);
                if (ex.InnerException != null)
                    Logger.Error($"Inner exception: {ex.InnerException.Message}");
                throw new UserFriendlyException("An error occurred while creating the educator. See logs for details.", ex);
            }
        }

        public async Task<Educator> GetEducatorByIdWithDetailsAsync(Guid id)
        {
            var query = await _educatorRepository.GetAllIncludingAsync(
                e => e.User,
                e => e.Students
            );

            return await query.FirstOrDefaultAsync(e => e.Id == id);
        }

        public IQueryable<Educator> GetAllEducatorsAsync()
        {
            return _educatorRepository.GetAllIncluding(e => e.User, e => e.Students);
        }

        public async Task<Educator> GetEducatorByUserIdAsync(long userId)
        {
            var educators = await _educatorRepository.GetAllIncludingAsync(
                e => e.User,
                e => e.Students
            );

            var educator = await educators.FirstOrDefaultAsync(e => e.UserId == userId);
            if (educator == null)
            {
                throw new UserFriendlyException("Educator not found");
            }

            return educator;
        }

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

        public async Task<Educator> UpdateEducatorAsync(
            Guid educatorId,
            string? firstName,
            string? surname,
            string? emailAddress,
            string? phoneNumber,
            string? username,
            string? password,
            string? highestQualification,
            int? yearsOfMathTeaching,
            string? biography)
        {
            var educator = await _educatorRepository.GetAsync(educatorId);
            if (educator == null)
                throw new UserFriendlyException("Educator not found");

            var user = await _userManager.GetUserByIdAsync(educator.UserId);
            if (user == null)
                throw new UserFriendlyException("User not found");

            // Only update fields that are provided (not null)
            if (!string.IsNullOrEmpty(firstName)) user.Name = firstName;
            if (!string.IsNullOrEmpty(surname)) user.Surname = surname;
            if (!string.IsNullOrEmpty(emailAddress)) user.EmailAddress = emailAddress;
            if (!string.IsNullOrEmpty(username)) user.UserName = username;
            if (!string.IsNullOrEmpty(phoneNumber)) user.PhoneNumber = phoneNumber;

            if (!string.IsNullOrEmpty(highestQualification)) educator.HighestQualification = highestQualification;
            if (yearsOfMathTeaching.HasValue) educator.YearsOfMathTeaching = yearsOfMathTeaching.Value;
            if (!string.IsNullOrEmpty(biography)) educator.Biography = biography;

            if (!string.IsNullOrEmpty(password))
            {
                var passwordResetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, passwordResetToken, password);
                if (!passwordResult.Succeeded)
                    throw new UserFriendlyException("Failed to update password: " + string.Join(", ", passwordResult.Errors));
            }

            await _educatorRepository.UpdateAsync(educator);
            await _userManager.UpdateAsync(user);

            return educator;
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

        public async Task<bool> DeleteEducatorAsync(Guid educatorId)
        {
            try
            {
                var educator = await _educatorRepository.GetAsync(educatorId);
                if (educator == null)
                    throw new UserFriendlyException("Educator not found");

                // Check if educator has students
                var students = await GetEducatorStudentsAsync(educatorId);
                if (students.Count > 0)
                    throw new UserFriendlyException("Cannot delete educator with assigned students. Please reassign students first.");

                var user = await _userManager.GetUserByIdAsync(educator.UserId);
                if (user != null)
                {
                    // Set user as inactive instead of deleting
                    user.IsActive = false;
                    await _userManager.UpdateAsync(user);
                }

                await _educatorRepository.DeleteAsync(educator);
                return true;
            }
            catch (Exception ex)
            {
                Logger.Error($"Error deleting educator: {ex.Message}", ex);
                throw new UserFriendlyException("An error occurred while deleting the educator. See logs for details.", ex);
            }
        }
    }
}