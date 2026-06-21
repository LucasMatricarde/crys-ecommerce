# Multi-stage build. Context = backend root (needs settings + libs + this service).
FROM gradle:8.10-jdk21 AS build
WORKDIR /workspace
COPY . .
RUN gradle :services:notification-service:bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/services/notification-service/build/libs/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]
