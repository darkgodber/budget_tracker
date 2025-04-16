# Базовый образ с Node.js
FROM node:16 AS build

# Рабочая директория в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости с флагом --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Копируем весь проект
COPY . .

# Собираем приложение
RUN npm run build

# Используем Nginx для сервинга
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Копируем кастомный конфиг, если нужно (опционально)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
