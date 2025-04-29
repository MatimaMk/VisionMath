using System.ComponentModel.DataAnnotations;

namespace visionMath.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}