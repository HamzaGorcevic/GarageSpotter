# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Set working directory
WORKDIR /src

# Copy only the project file initially (improves caching)
COPY ["AutoHub/AutoHub.csproj", "AutoHub/"]

# Restore dependencies
WORKDIR /src/AutoHub
RUN dotnet restore --verbosity detailed

# Debug: List files after restore
RUN ls -l

# Copy the entire source code
COPY . /src

# Debug: List files after full copy
RUN ls -l /src/AutoHub

# Publish the application
RUN dotnet publish "AutoHub.csproj" -c Release -o /app/publish

# Stage 2: Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

# Set working directory
WORKDIR /app

# Expose ports
EXPOSE 80
EXPOSE 443

# Copy the published application
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80

# Set entry point
ENTRYPOINT ["dotnet", "AutoHub.dll"]
