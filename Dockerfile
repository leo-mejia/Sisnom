FROM node:20-alpine AS frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY --from=frontend /app/client/dist ./client/dist
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Exact JAR name from pom.xml version 1.0.0
COPY --from=build /app/target/sisnom-springboot-1.0.0.jar app.jar
EXPOSE ${PORT:-8080}
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
