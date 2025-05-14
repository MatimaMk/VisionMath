using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.AspNetCore.Http;
using visionMath.Domain.Resources;
using visionMath.Services.ContentServices.Dtos;

namespace visionMath.Services.ContentServices
{
    public class ContentAppService : AsyncCrudAppService<Content, ContentDto, Guid, PagedContentResultRequestDto, CreateContentDto, UpdateContentDto>
    {
        private readonly IRepository<Content, Guid> _contentRepository;
        private readonly string _uploadsFolder;

        public ContentAppService(IRepository<Content, Guid> contentRepository)
            : base(contentRepository)
        {
            _contentRepository = contentRepository;
            _uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "content");

            // Ensure the uploads directory exists
            if (!Directory.Exists(_uploadsFolder))
            {
                Directory.CreateDirectory(_uploadsFolder);
            }
        }

        public override async Task<ContentDto> CreateAsync(CreateContentDto input)
        {
           
            var content = MapToEntity(input);

            await _contentRepository.InsertAsync(content);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToEntityDto(content);
        }

        public async Task<ContentDto> CreateWithFileAsync(CreateContentDto input, IFormFile pdfFile)
        {
   

            var content = MapToEntity(input);

            await _contentRepository.InsertAsync(content);
            await CurrentUnitOfWork.SaveChangesAsync();

            // If PDF file is provided, save it
            if (pdfFile != null && pdfFile.Length > 0)
            {
                await SavePdfFile(content, pdfFile);
            }

            return MapToEntityDto(content);
        }

        public override async Task<ContentDto> UpdateAsync(UpdateContentDto input)
        {


            var content = await _contentRepository.GetAsync(input.Id);
            if (content == null)
            {
                throw new EntityNotFoundException(typeof(Content), input.Id);
            }

            MapToEntity(input, content);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToEntityDto(content);
        }

        public async Task<ContentDto> UpdateWithFileAsync(UpdateContentDto input, IFormFile pdfFile)
        {


            var content = await _contentRepository.GetAsync(input.Id);
            if (content == null)
            {
                throw new EntityNotFoundException(typeof(Content), input.Id);
            }

            MapToEntity(input, content);

            // If PDF file is provided, update it
            if (pdfFile != null && pdfFile.Length > 0)
            {
                await SavePdfFile(content, pdfFile);
            }

            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToEntityDto(content);
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
         

            var content = await _contentRepository.GetAsync(input.Id);
            if (content == null)
            {
                throw new EntityNotFoundException(typeof(Content), input.Id);
            }

            // Delete associated file if exists
            DeletePdfFile(content);

            await _contentRepository.DeleteAsync(input.Id);
        }

        public override async Task<ContentDto> GetAsync(EntityDto<Guid> input)
        {
            var content = await _contentRepository.GetAsync(input.Id);
            if (content == null)
            {
                throw new EntityNotFoundException(typeof(Content), input.Id);
            }

            return MapToEntityDto(content);
        }

        public override async Task<PagedResultDto<ContentDto>> GetAllAsync(PagedContentResultRequestDto input)
        {
          

            var query = _contentRepository.GetAll();

            // Apply filtering
            query = query.Where(c =>
                !input.ContentTypeId.HasValue || c.ContentType == (ReflistContentType)(int)input.ContentTypeId.Value);

            if (!string.IsNullOrWhiteSpace(input.Keyword))
            {
                query = query.Where(c => c.ContentTitle.Contains(input.Keyword) ||
                                       c.ContentDescription.Contains(input.Keyword));
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(input.Sorting))
            {
                query = ApplySorting(query, input);
            }
            else
            {
                query = query.OrderBy(c => c.OrderNumber);
            }

            // Apply paging
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            var contents = await AsyncQueryableExecuter.ToListAsync(
                query.Skip(input.SkipCount).Take(input.MaxResultCount));

            return new PagedResultDto<ContentDto>(
                totalCount,
                contents.Select(MapToEntityDto).ToList()
            );
        }

        public async Task<ContentDto> UploadPdfFileAsync(Guid contentId, IFormFile file)
        {
     

            if (file == null || file.Length == 0)
            {
                throw new UserFriendlyException("File is empty");
            }

            var content = await _contentRepository.GetAsync(contentId);
            if (content == null)
            {
                throw new EntityNotFoundException(typeof(Content), contentId);
            }

            await SavePdfFile(content, file);

            return MapToEntityDto(content);
        }

        public async Task<byte[]> GetPdfFileAsync(Guid contentId)
        {
       

            var content = await _contentRepository.GetAsync(contentId);
            if (content == null || string.IsNullOrEmpty(content.PdfFilePath))
            {
                throw new UserFriendlyException("File not found");
            }

            if (!File.Exists(content.PdfFilePath))
            {
                throw new UserFriendlyException("File not found on server");
            }

            return await File.ReadAllBytesAsync(content.PdfFilePath);
        }

        public async Task<FileDto> DownloadPdfFileAsync(Guid contentId)
        {
            

            var content = await _contentRepository.GetAsync(contentId);
            if (content == null || string.IsNullOrEmpty(content.PdfFilePath))
            {
                throw new UserFriendlyException("File not found");
            }

            if (!File.Exists(content.PdfFilePath))
            {
                throw new UserFriendlyException("File not found on server");
            }

            var fileBytes = await File.ReadAllBytesAsync(content.PdfFilePath);
            var fileName = Path.GetFileName(content.PdfFilePath);

            return new FileDto
            {
                FileName = fileName,
                FileType = "application/pdf",
                FileBytes = fileBytes
            };
        }

        #region Helper Methods

        private async Task SavePdfFile(Content content, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new UserFriendlyException("File is empty");
            }

            if (!file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase))
            {
                throw new UserFriendlyException("Only PDF files are allowed");
            }

            // Delete old file if exists
            DeletePdfFile(content);

            // Generate unique filename
            var fileName = $"{content.Id}_{DateTime.Now.Ticks}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(_uploadsFolder, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Update entity
            content.PdfFilePath = filePath;
            await _contentRepository.UpdateAsync(content);
        }

        private void DeletePdfFile(Content content)
        {
            if (!string.IsNullOrEmpty(content.PdfFilePath) && File.Exists(content.PdfFilePath))
            {
                File.Delete(content.PdfFilePath);
            }
        }

        #endregion
    }
}
