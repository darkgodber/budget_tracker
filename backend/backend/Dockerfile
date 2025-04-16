# Этап 1: сборка и публикация .NET приложения
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем файл проекта и выполняем restore
COPY backend.csproj ./
RUN dotnet restore

# Копируем все файлы проекта и публикуем
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Этап 2: финальный образ на основе рантайма
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
