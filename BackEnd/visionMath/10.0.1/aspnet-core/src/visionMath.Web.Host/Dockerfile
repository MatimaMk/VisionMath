FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/visionMath.Web.Host/visionMath.Web.Host.csproj", "src/visionMath.Web.Host/"]
COPY ["src/visionMath.Web.Core/visionMath.Web.Core.csproj", "src/visionMath.Web.Core/"]
COPY ["src/visionMath.Application/visionMath.Application.csproj", "src/visionMath.Application/"]
COPY ["src/visionMath.Core/visionMath.Core.csproj", "src/visionMath.Core/"]
COPY ["src/visionMath.EntityFrameworkCore/visionMath.EntityFrameworkCore.csproj", "src/visionMath.EntityFrameworkCore/"]
WORKDIR "/src/src/visionMath.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/visionMath.Web.Host", "src/visionMath.Web.Host"]
COPY ["src/visionMath.Web.Core", "src/visionMath.Web.Core"]
COPY ["src/visionMath.Application", "src/visionMath.Application"]
COPY ["src/visionMath.Core", "src/visionMath.Core"]
COPY ["src/visionMath.EntityFrameworkCore", "src/visionMath.EntityFrameworkCore"]
WORKDIR "/src/src/visionMath.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "visionMath.Web.Host.dll"]
