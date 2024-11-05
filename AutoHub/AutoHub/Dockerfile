FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["AutoHub.csproj", "./"]
RUN dotnet restore "./AutoHub.csproj"

COPY . .
RUN dotnet publish "AutoHub.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "AutoHub.dll"]
