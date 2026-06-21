package com.crys.gateway.web;

import com.crys.gateway.config.AuthProperties;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

/**
 * <strong>DEMO / DEV ONLY.</strong> Mints HS256 JWTs so the auth flow is testable
 * end-to-end without an identity provider. This stands in for a real IdP and MUST be
 * replaced (and this endpoint removed/secured) before production use.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtEncoder jwtEncoder;
    private final AuthProperties props;

    public AuthController(JwtEncoder jwtEncoder, AuthProperties props) {
        this.jwtEncoder = jwtEncoder;
        this.props = props;
    }

    /** Request body for {@link #token(TokenRequest)}. */
    public record TokenRequest(String subject) {
    }

    /** Response: the signed JWT and its lifetime in seconds. */
    public record TokenResponse(String token, long expiresInSeconds) {
    }

    @PostMapping(value = "/token", produces = MediaType.APPLICATION_JSON_VALUE)
    public TokenResponse token(@RequestBody TokenRequest request) {
        Instant now = Instant.now();
        long ttlSeconds = props.tokenTtl().toSeconds();
        Instant expiresAt = now.plusSeconds(ttlSeconds);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(request.subject())
                .issuer(props.issuer())
                .issuedAt(now)
                .expiresAt(expiresAt)
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();

        return new TokenResponse(token, ttlSeconds);
    }
}
