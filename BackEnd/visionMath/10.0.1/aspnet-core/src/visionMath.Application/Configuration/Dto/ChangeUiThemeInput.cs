using System.ComponentModel.DataAnnotations;

namespace visionMath.Configuration.Dto;

public class ChangeUiThemeInput
{
    [Required]
    [StringLength(32)]
    public string Theme { get; set; }
}
