# Build Spring Boot backend
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy only backend code
COPY backend/pom.xml ./
COPY backend/src ./src

# Build jar
RUN mvn clean package -DskipTests

# Runtime image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy built jar
COPY --from=builder /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Run application
CMD ["java", "-jar", "app.jar", "--server.port=8080"]