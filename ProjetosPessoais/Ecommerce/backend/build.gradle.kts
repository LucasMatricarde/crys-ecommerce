plugins {
    java
    alias(libs.plugins.spring.boot) apply false
    alias(libs.plugins.spring.dependency.management) apply false
}

allprojects {
    group = "com.crys"
    version = "0.1.0"

    repositories {
        mavenCentral()
    }
}

subprojects {
    apply(plugin = "java")

    configure<JavaPluginExtension> {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(21))
        }
    }

    tasks.withType<Test>().configureEach {
        useJUnitPlatform()
        // Docker Engine 29 raised its MinAPIVersion to 1.40; the docker-java client
        // bundled with Testcontainers still defaults below that, so the engine rejects
        // /info with HTTP 400. Pin a version inside the engine's supported range.
        systemProperty("api.version", providers.gradleProperty("dockerApiVersion").orElse("1.44").get())
    }
}
