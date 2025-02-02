using HotChocolate;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace AutoHub.Helpers
{
    public static class FileConverter
    {
        public static async Task<IFormFile> ToIFormFileAsync(this IFile? file)
        {
            if (file == null) return null;

            var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0;

            return new FormFile(stream, 0, stream.Length, file.Name, file.Name)
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/octet-stream"
            };
        }

        public static async Task<List<IFormFile>> ToIFormFilesAsync(this IEnumerable<IFile>? files)
        {
            if (files == null) return new List<IFormFile>();

            var formFiles = new List<IFormFile>();
            foreach (var file in files)
            {
                formFiles.Add(await file.ToIFormFileAsync());
            }
            return formFiles;
        }
    }
}