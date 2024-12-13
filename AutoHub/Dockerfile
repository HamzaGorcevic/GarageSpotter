# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Set the working directory in the container to /src
WORKDIR /src

# Copy only the project file initially to leverage Docker cache for dependencies
COPY ["AutoHub/AutoHub.csproj", "AutoHub/"]
WORKDIR /src/AutoHub
RUN dotnet restore

# Copy the rest of the project files
COPY . /src

# Publish the application to the /app/publish directory
RUN dotnet publish "AutoHub.csproj" -c Release -o /app/publish

# Stage 2: Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80   
EXPOSE 443   

# Copy the build output from the previous stage
COPY --from=build /app/publish .

# Set ASP.NET Core to listen on port 80
ENV ASPNETCORE_URLS=http://+:80

# Set the entry point to run the application
ENTRYPOINT ["dotnet", "AutoHub.dll"]
