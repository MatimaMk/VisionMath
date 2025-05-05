using AutoMapper;
using visionMath.Authorization.Users;
using visionMath.Domain.Persons;
using visionMath.Services.PersonServices.Dtos;

namespace visionMath.Services.PersonServices
{
    public class EducatorProfile : Profile
    {
        public EducatorProfile()
        {
            CreateMap<Educator, EducatorResponseDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.Surname, opt => opt.MapFrom(src => src.User.Surname))
                .ForMember(dest => dest.EmailAddress, opt => opt.MapFrom(src => src.User.EmailAddress))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName));

            CreateMap<CreateEducatorDto, User>(MemberList.None);
            CreateMap<UpdateEducatorDto, Educator>(MemberList.Source);
        }
    }
}