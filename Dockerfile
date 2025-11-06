FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=build /app/dist/navega-sin-ahogarte /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 (el puerto estándar de Nginx)
EXPOSE 80
