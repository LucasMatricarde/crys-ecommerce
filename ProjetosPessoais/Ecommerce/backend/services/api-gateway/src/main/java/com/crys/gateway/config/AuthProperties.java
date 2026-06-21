package com.crys.gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/**
 * Binds the {@code crys.auth} configuration block.
 *
 * @param secret   HS256 signing/validation secret (>=32 chars). Dev default in
 *                 application.yml; prod overrides via the {@code JWT_SECRET} env var.
 * @param issuer   expected/emitted {@code iss} claim (e.g. {@code crys-gateway}).
 * @param tokenTtl lifetime applied to minted tokens ({@code exp = iat + tokenTtl}).
 */
@ConfigurationProperties("crys.auth")
public record AuthProperties(String secret, String issuer, Duration tokenTtl) {
}
