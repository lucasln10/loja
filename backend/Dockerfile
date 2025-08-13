# Stage 1: Build the application with Maven using JDK 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Cache dependencies first
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -q -e -DskipTests dependency:go-offline

# Copy sources and build
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -q -DskipTests clean package

# Stage 2: Runtime image with JDK 21
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the fat JAR from the builder stage
COPY --from=builder /app/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
