package com.crys.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.time.Duration;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Boots the gateway against a real Redis (rate limiter dependency) and exercises the
 * security decisions end-to-end through {@link WebTestClient}. Downstream services are
 * unreachable in the test, so a successful auth decision is asserted as "status != 401"
 * rather than a full proxy response.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class GatewayAuthIT {

    static final GenericContainer<?> REDIS =
            new GenericContainer<>(DockerImageName.parse("redis:7-alpine")).withExposedPorts(6379);

    static {
        REDIS.start();
    }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", REDIS::getHost);
        registry.add("spring.data.redis.port", () -> REDIS.getMappedPort(6379));
    }

    @LocalServerPort
    int port;

    WebTestClient client() {
        return WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .responseTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Test
    void healthIsPublic() {
        client().get().uri("/actuator/health")
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    void protectedRouteWithoutTokenIsUnauthorized() {
        client().post().uri("/api/orders")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void protectedRouteWithMalformedTokenIsUnauthorized() {
        client().post().uri("/api/orders")
                .header(HttpHeaders.AUTHORIZATION, "Bearer not.a.jwt")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void mintEndpointReturnsToken() {
        client().post().uri("/api/auth/token")
                .bodyValue(Map.of("subject", "u1"))
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.token").isNotEmpty()
                .jsonPath("$.expiresInSeconds").isNumber();
    }

    @Test
    void protectedRouteWithValidTokenPassesAuth() {
        String token = mintToken();

        // Downstream is unreachable in the test; proving the security decision means
        // asserting the request was NOT rejected with 401.
        int status = client().post().uri("/api/orders")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .exchange()
                .returnResult(Void.class)
                .getStatus()
                .value();

        assertThat(status).isNotEqualTo(HttpStatus.UNAUTHORIZED.value());
    }

    private String mintToken() {
        return client().post().uri("/api/auth/token")
                .bodyValue(Map.of("subject", "u1"))
                .exchange()
                .expectStatus().isOk()
                .returnResult(MintResponse.class)
                .getResponseBody()
                .blockFirst()
                .token();
    }

    record MintResponse(String token, long expiresInSeconds) {
    }
}
