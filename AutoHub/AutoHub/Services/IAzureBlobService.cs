namespace AutoHub.Services
{
    public interface IAzureBlobService
    {
        Task<string> UploadFileAsync(IFormFile file, string containerName);
        Task<List<string>> UploadMultipleFilesAsync(List<IFormFile> files, string containerName);


    }
}
