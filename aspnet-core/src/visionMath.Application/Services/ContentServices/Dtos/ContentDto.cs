using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using visionMath.Domain.Resources;

namespace visionMath.Services.ContentServices.Dtos
{
    [AutoMap(typeof(Content))]
    public class ContentDto : EntityDto<Guid>
    {
        public string ContentTitle { get; set; }

        public string ContentDescription { get; set; }

        public ContentType? ContentType { get; set; }

        public string TextContent { get; set; }

        public int OrderNumber { get; set; }

        public string PdfFilePath { get; set; }

        public bool HasPdfFile => !string.IsNullOrEmpty(PdfFilePath);
    }
    [AutoMap(typeof(Content))]
    public class CreateContentDto
    {
        [Required]
        [StringLength(256)]
        public string ContentTitle { get; set; }

        [Required]
        [StringLength(1000)]
        public string ContentDescription { get; set; }

        [Required]
        public ReflistContentType? ContentType { get; set; }

        public string TextContent { get; set; }

        public int OrderNumber { get; set; }
    }
    [AutoMap(typeof(Content))]
    public class UpdateContentDto : CreateContentDto, IEntityDto<Guid>
    {
        [Required]
        public Guid Id { get; set; } // Required by IEntityDto
    }
}

[AutoMap(typeof(Content))]
    public class PagedContentResultRequestDto : PagedResultRequestDto
    {
        public string Keyword { get; set; }

        public int? ContentTypeId { get; set; }

        public string Sorting { get; set; }
    }
    public class FileDto
    {
        public string FileName { get; set; }

        public string FileType { get; set; }

        public byte[] FileBytes { get; set; }
    }

