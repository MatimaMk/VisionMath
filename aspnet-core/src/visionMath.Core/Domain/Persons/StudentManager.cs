using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using visionMath.Authorization.Users;
using visionMath.Domain.ProgressResources;

namespace visionMath.Domain.Persons
{
    public class StudentManager : DomainService
    {

        private readonly UserManager _userManager;
        private readonly IRepository<Student, Guid> _studentRepository;
        private readonly IRepository<Student, Guid> _repository;
        private readonly IRepository<Educator, Guid> _educatorRepository;

        public StudentManager(UserManager userManager, IRepository<Student, Guid> studentRepository, IRepository<Student, Guid> repository, IRepository<Educator, Guid> educatorRepository)
        {
            _userManager = userManager;
            _studentRepository = studentRepository;
            _repository = repository;
            _educatorRepository = educatorRepository;
        }

        public async Task<Student> CreateStudentAsync(
          string firstName,
          string surname,
          string emailAddress,
          string phoneNumber,
          string username,
          string password,
          DateTime dateOfBirth,
          string studentNumber,
          Guid educatorId)
        {
            try
            {
                // Verify educator exists before linking
                var educator = await _educatorRepository.GetAsync(educatorId);
                if (educator == null)
                {
                    throw new UserFriendlyException("Cannot assign student to a non-existent educator");
                }

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

                // Add to Student role
                await _userManager.AddToRoleAsync(user, "STUDENT");

                // Create student entity
                var student = new Student
                {
                    UserId = Convert.ToInt64(user.Id),
                    StudentNumber = studentNumber,
                    PhoneNumber = phoneNumber,
                    DateOfBirth = dateOfBirth,
                    EducatorId = educatorId,
                    Tests = new List<Test>(),
                    ProgressRecords = new List<Progress>()
                };

                await _studentRepository.InsertAsync(student);

                return student;
            }
            catch (Exception ex)
            {
                Logger.Error($"Error creating student: {ex.Message}", ex);
                if (ex.InnerException != null)
                    Logger.Error($"Inner exception: {ex.InnerException.Message}");
                throw new UserFriendlyException("An error occurred while creating the student. See logs for details.", ex);
            }
        }

        public async Task<Student> GetStudentByIdWithDetailsAsync(Guid id)
        {
            var query = await _studentRepository.GetAllIncludingAsync(
                s => s.User,
                s => s.Tests,
                s => s.ProgressRecords,
                s => s.Educator
            );

            return await query.FirstOrDefaultAsync(s => s.Id == id);
        }

        public IQueryable<Student> GetAllStudentsAsync()
        {
            return _studentRepository.GetAllIncluding(s => s.User, s => s.Educator);
        }

        public async Task<Student> GetStudentByUserIdAsync(long userId)
        {
            var students = await _studentRepository.GetAllIncludingAsync(
                s => s.User,
                s => s.Tests,
                s => s.ProgressRecords,
                s => s.Educator
            );

            var student = await students.FirstOrDefaultAsync(s => s.UserId == userId);
            if (student == null)
            {
                throw new UserFriendlyException("Student not found");
            }

            return student;
        }

        public async Task<IList<Student>> GetStudentsByEducatorIdAsync(Guid educatorId)
        {
            var query = await _studentRepository.GetAllIncludingAsync(s => s.User);
            return await query.Where(s => s.EducatorId == educatorId).ToListAsync();
        }

        public async Task<Student> UpdateStudentAsync(
            Guid studentId,
            string? firstName,
            string? surname,
            string? emailAddress,
            string? phoneNumber,
            string? username,
            string? password,
            string? studentNumber,
            Guid? educatorId)
        {
            var student = await _studentRepository.GetAsync(studentId);
            if (student == null)
                throw new UserFriendlyException("Student not found");

            var user = await _userManager.GetUserByIdAsync(student.UserId);
            if (user == null)
                throw new UserFriendlyException("User not found");

            // Only update fields that are provided (not null)
            if (!string.IsNullOrEmpty(firstName)) user.Name = firstName;
            if (!string.IsNullOrEmpty(surname)) user.Surname = surname;
            if (!string.IsNullOrEmpty(emailAddress)) user.EmailAddress = emailAddress;
            if (!string.IsNullOrEmpty(username)) user.UserName = username;
            if (!string.IsNullOrEmpty(phoneNumber)) student.PhoneNumber = phoneNumber;
            if (!string.IsNullOrEmpty(studentNumber)) student.StudentNumber = studentNumber;

            if (educatorId.HasValue && educatorId.Value != student.EducatorId)
            {
                // Verify new educator exists
                var educator = await _educatorRepository.GetAsync(educatorId.Value);
                if (educator == null)
                {
                    throw new UserFriendlyException("Cannot assign student to a non-existent educator");
                }

                // Update the educator assignment
                student.EducatorId = educatorId.Value;

                // Add logging for educator change
                Logger.Info($"Student {studentId} reassigned to Educator {educatorId.Value}");
            }

            if (!string.IsNullOrEmpty(password))
            {
                var passwordResetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, passwordResetToken, password);
                if (!passwordResult.Succeeded)
                    throw new UserFriendlyException("Failed to update password: " + string.Join(", ", passwordResult.Errors));
            }

            await _studentRepository.UpdateAsync(student);
            await _userManager.UpdateAsync(user);

            return student;
        }

        public async Task<bool> DeleteStudentAsync(Guid studentId)
        {
            try
            {
                var student = await _studentRepository.GetAsync(studentId);
                if (student == null)
                    throw new UserFriendlyException("Student not found");

                var user = await _userManager.GetUserByIdAsync(student.UserId);
                if (user != null)
                {
                    // Set user as inactive instead of deleting
                    user.IsActive = false;
                    await _userManager.UpdateAsync(user);
                }

                await _studentRepository.DeleteAsync(student);
                return true;
            }
            catch (Exception ex)
            {
                Logger.Error($"Error deleting student: {ex.Message}", ex);
                throw new UserFriendlyException("An error occurred while deleting the student. See logs for details.", ex);
            }
        }
    }
}