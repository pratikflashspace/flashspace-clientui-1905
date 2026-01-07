# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Package files copy karo
COPY package*.json ./

# Dependencies install karo
RUN npm ci

# Source code copy karo
COPY . .

# Build karo (production)
RUN npm run build

# Production stage - Nginx use karenge
FROM nginx:alpine

# Custom nginx config copy karo
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build output copy karo
COPY --from=builder /app/dist /usr/share/nginx/html

# Port expose karo
EXPOSE 80

# Nginx start karo
CMD ["nginx", "-g", "daemon off;"]
