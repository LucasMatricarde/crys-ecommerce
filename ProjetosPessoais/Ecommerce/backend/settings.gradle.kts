plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
}

rootProject.name = "crys-backend"

include(
    "libs:common-events",
    "libs:messaging",
    "services:catalog-service",
    "services:api-gateway",
    "services:order-service",
    "services:inventory-service",
    "services:payment-service",
    "services:order-query-service",
    "services:notification-service",
)
