# Multi-stage build for React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY frontend/ ./

# Build frontend
RUN npm run build

# Multi-stage build for Spring Boot backend
FROM maven:3.9-eclipse-temurin-17 AS backend-builder

WORKDIR /app/backend

# Copy backend files
COPY backend/pom.xml ./
COPY backend/src ./src

# Build backend
RUN mvn clean package -DskipTests

# Final production image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install nginx for serving React static files
RUN apk add --no-cache nginx

# Copy backend jar
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy frontend build output to nginx html directory
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Create directories for nginx
RUN mkdir -p /var/log/nginx /run

# Expose ports
EXPOSE 80 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start command - run nginx in background and Java app
CMD sh -c "nginx -g 'daemon off;' & java -jar app.jar --server.port=8080"
