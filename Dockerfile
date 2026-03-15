# Multi-stage: Frontend build → Maven build → Runtime
FROM node:20-alpine AS frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ .
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Copy frontend dist (pom.xml resources will handle to static)
COPY --from=frontend /app/client/dist ./client/dist
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE ${PORT:-8080}
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
