# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments (ye docker-compose se aayenge)
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_MAPS_API_KEY

# Environment variables set karo build ke liye
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

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
