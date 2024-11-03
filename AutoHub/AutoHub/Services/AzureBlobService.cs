using AutoHub.Services;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

public class AzureBlobService:IAzureBlobService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _blobConnectionString;
    private readonly IConfiguration _configuration;

    public AzureBlobService(IConfiguration configuration)
    {
        _blobConnectionString = configuration.GetSection("AzureBlobStorage")["ConnectionString"]
                        ?? throw new ArgumentNullException(nameof(_blobConnectionString));

        _blobServiceClient = new BlobServiceClient(_blobConnectionString);
    }

    public async Task<string> UploadFileAsync(IFormFile file, string containerName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.None);

        var blobClient = containerClient.GetBlobClient(Guid.NewGuid().ToString() + Path.GetExtension(file.FileName));

        await using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
        }

        return blobClient.Uri.ToString();
    }

    public async Task<List<string>> UploadMultipleFilesAsync(List<IFormFile> files, string containerName)
    {
        var urls = new List<string>();
        foreach (var file in files)
        {
            var url = await UploadFileAsync(file, containerName);
            urls.Add(url);
        }
        return urls;
    }
}
