package com.crys.gateway;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtIssuerValidator;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import reactor.test.StepVerifier;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that a token minted with {@link JwtEncoder} round-trips through
 * {@link ReactiveJwtDecoder} (same secret/algorithm as {@code SecurityConfig}), and
 * that an expired token is rejected.
 */
class AuthTokenRoundTripTest {

    private static final String SECRET = "crys-test-secret-must-be-at-least-32-bytes-long!!";
    private static final String ISSUER = "crys-gateway";

    private final SecretKeySpec key =
            new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

    private final JwtEncoder encoder = new NimbusJwtEncoder(new ImmutableSecret<>(key));

    private ReactiveJwtDecoder decoder() {
        NimbusReactiveJwtDecoder decoder = NimbusReactiveJwtDecoder
                .withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
        OAuth2TokenValidator<Jwt> validators = new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefault(), new JwtIssuerValidator(ISSUER));
        decoder.setJwtValidator(validators);
        return decoder;
    }

    private String mint(Instant issuedAt, Instant expiresAt) {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject("u1").issuer(ISSUER).issuedAt(issuedAt).expiresAt(expiresAt).build();
        return encoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
    }

    @Test
    void validTokenDecodesWithSubjectAndIssuer() {
        Instant now = Instant.now();
        String token = mint(now, now.plusSeconds(3600));

        StepVerifier.create(decoder().decode(token))
                .assertNext(jwt -> {
                    assertThat(jwt.getSubject()).isEqualTo("u1");
                    assertThat(jwt.getClaimAsString("iss")).isEqualTo(ISSUER);
                })
                .verifyComplete();
    }

    @Test
    void expiredTokenIsRejected() {
        Instant past = Instant.now().minusSeconds(7200);
        String expired = mint(past, past.plusSeconds(3600)); // expired 1h ago

        StepVerifier.create(decoder().decode(expired))
                .expectError()
                .verify();
    }
}
