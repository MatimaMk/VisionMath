using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;
using Abp.Domain.Entities.Auditing;
using visionMath.Domain.ProgressResources;

namespace visionMath.Domain.Resources
{
    public class Content : FullAuditedEntity<Guid>
    {
        [Required]
        public string ContentTitle { get; set; }
        [Required]
        public string ContentDescription { get; set; }
        [Required]
        public virtual ReflistContentType? ContentType { get; set; }
        public string TextContent { get; set; }
        // Sequence position
        public int OrderNumber { get; set; }

        public  string? PdfFilePath { get; set; }

        public virtual ICollection<Test> Tests { get; set; }


    }

}
