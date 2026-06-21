# Multi-stage build. Context = backend root (settings includes all subprojects).
FROM gradle:8.10-jdk21 AS build
WORKDIR /workspace
COPY . .
RUN gradle :services:payment-service:bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/services/payment-service/build/libs/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
