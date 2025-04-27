# 1) Stage: build
FROM node:18-alpine AS build

WORKDIR /app

# Копируем только package*.json, чтобы кешировать npm install
COPY package.json package-lock.json ./

# Устанавливаем все зависимости (и prod, и dev)
RUN npm ci

# Копируем весь код и собираем
COPY . .
RUN npm run build

# 2) Stage: production
FROM nginx:alpine

# Копируем собранную папку в nginx
COPY --from=build /app/build /usr/share/nginx/html

# Опционально: свои настройки nginx
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
