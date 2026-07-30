# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_BASE_PATH=/
RUN test -n "$VITE_API_BASE_URL" \
    && VITE_API_BASE_URL="$VITE_API_BASE_URL" \
       VITE_BASE_PATH="$VITE_BASE_PATH" \
       npm run build


FROM nginxinc/nginx-unprivileged:1.28-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
