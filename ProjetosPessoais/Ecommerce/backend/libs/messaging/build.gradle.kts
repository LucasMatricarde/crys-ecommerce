plugins {
    `java-library`
    alias(libs.plugins.spring.dependency.management)
}

dependencyManagement {
    imports {
        mavenBom(libs.spring.boot.dependencies.get().toString())
    }
}

dependencies {
    // Shared Spring plumbing for the saga: transactional outbox, idempotent consumer,
    // EventEnvelope JSON codec, Kafka producer/consumer + DLQ wiring. Domain logic
    // (entities, listeners) lives in each service; this is the reusable mechanism.
    api(project(":libs:common-events"))
    api("org.springframework.boot:spring-boot-starter-data-jpa")
    api("org.springframework.kafka:spring-kafka")
    api("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
}
