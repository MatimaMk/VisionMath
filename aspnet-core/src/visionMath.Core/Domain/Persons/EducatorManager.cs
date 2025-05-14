using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using visionMath.Authorization.Users;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace visionMath.Domain.Persons
{
    public class EducatorManager : DomainService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<Educator, Guid> _educatorRepository;

        public EducatorManager(
            UserManager userManager,
            IRepository<Educator, Guid> educatorRepository)
        {
            _userManager = userManager;
            _educatorRepository = educatorRepository;
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
                  //  PhoneNumber = phoneNumber,
                    IsActive = true
                };

                var result = await _userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                {
                    throw new UserFriendlyException("User creation failed: " + string.Join(", ", result.Errors));
                }

                // Add to Educator role
                await _userManager.AddToRoleAsync(user, "EDUCATOR");

                // Create educator entity
                var educator = new Educator
                {
                    UserId = user.Id,
                    HighestQualification = highestQualification,
                    YearsOfMathTeaching = yearsOfMathTeaching,
                    Biography = biography,
                    Students = new List<Student>()
                };

                await _educatorRepository.InsertAsync(educator);
                await CurrentUnitOfWork.SaveChangesAsync();

                return educator;
            }
            catch (Exception ex)
            {
                Logger.Error("Educator creation failed", ex);
                throw new UserFriendlyException("An error occurred while creating educator");
            }
        }

        public async Task<Educator> GetEducatorWithDetailsAsync(Guid id)
        {
            return await _educatorRepository.GetAll()
                .Include(e => e.User)
                .Include(e => e.Students)
                .FirstOrDefaultAsync(e => e.Id == id)
                ?? throw new UserFriendlyException("Educator not found");
        }

        public IQueryable<Educator> GetAllEducatorsWithDetails()
        {
            return _educatorRepository.GetAll()
                .Include(e => e.User)
                .Include(e => e.Students);
        }

        //public async Task<Educator> UpdateEducatorAsync(Guid id, UpdateEducatorDto input)
        //{
        //    var educator = await _educatorRepository.GetAll()
        //        .Include(e => e.User)
        //        .FirstOrDefaultAsync(e => e.Id == id);

        //    if (educator == null)
        //        throw new UserFriendlyException("Educator not found");

        //    // Update user properties
        //    if (!string.IsNullOrEmpty(input.FirstName)) educator.User.Name = input.FirstName;
        //    if (!string.IsNullOrEmpty(input.Surname)) educator.User.Surname = input.Surname;
        //    if (!string.IsNullOrEmpty(input.EmailAddress)) educator.User.EmailAddress = input.EmailAddress;
        //    if (!string.IsNullOrEmpty(input.PhoneNumber)) educator.User.PhoneNumber = input.PhoneNumber;
        //    if (!string.IsNullOrEmpty(input.UserName)) educator.User.UserName = input.UserName;

        //    // Update educator properties
        //    if (!string.IsNullOrEmpty(input.HighestQualification))
        //        educator.HighestQualification = input.HighestQualification;
        //    if (input.YearsOfMathTeaching.HasValue)
        //        educator.YearsOfMathTeaching = input.YearsOfMathTeaching.Value;
        //    if (!string.IsNullOrEmpty(input.Biography))
        //        educator.Biography = input.Biography;

        //    // Update password if provided
        //    if (!string.IsNullOrEmpty(input.Password))
        //    {
        //        var token = await _userManager.GeneratePasswordResetTokenAsync(educator.User);
        //        var result = await _userManager.ResetPasswordAsync(educator.User, token, input.Password);
        //        if (!result.Succeeded)
        //            throw new UserFriendlyException("Password update failed: " + string.Join(", ", result.Errors));
        //    }

        //    await _educatorRepository.UpdateAsync(educator);
        //    await _userManager.UpdateAsync(educator.User);

        //    return educator;
        //}
    }
}