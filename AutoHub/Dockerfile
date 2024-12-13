# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copy only the project file initially
COPY ["AutoHub/AutoHub.csproj", "AutoHub/"]
WORKDIR /src/AutoHub
RUN dotnet restore --verbosity detailed

# Debug: Verify files after restore
RUN ls -l

COPY . /src

# Debug: Verify files after full copy
RUN ls -l /src/AutoHub

RUN dotnet publish "AutoHub.csproj" -c Release -o /app/publish

# Stage 2: Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "AutoHub.dll"]
