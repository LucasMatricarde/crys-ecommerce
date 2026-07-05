package com.crys.gateway.security;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Forwards the authenticated caller's identity downstream as {@code X-User-Id}.
 *
 * <p>Anti-spoof: any client-supplied {@code X-User-Id} is stripped on every request, so
 * the header downstream is always gateway-authored. When the security context holds a
 * {@link JwtAuthenticationToken}, the header is set to the token {@code sub}. For
 * public/unauthenticated routes there is no authentication, so the header is simply
 * absent (after stripping).
 *
 * <p>Headers are rebuilt into a fresh writable {@link HttpHeaders} via a request
 * decorator: the request builder's {@code headers(Consumer)} exposes a read-only view
 * in this Spring version, so mutating it directly throws {@code UnsupportedOperationException}.
 */
@Component
public class ClaimForwardingFilter implements GlobalFilter, Ordered {

    public static final String USER_ID_HEADER = "X-User-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(auth -> auth instanceof JwtAuthenticationToken)
                .map(this::subjectOf)
                // Authenticated: forward sub as X-User-Id.
                .map(sub -> chain.filter(withUserId(exchange, sub)))
                // Public/unauthenticated: strip the header, forward nothing.
                .switchIfEmpty(Mono.fromSupplier(() -> chain.filter(withUserId(exchange, null))))
                .flatMap(mono -> mono);
    }

    private String subjectOf(Authentication auth) {
        return ((JwtAuthenticationToken) auth).getToken().getSubject();
    }

    /**
     * Returns the exchange with a request whose {@code X-User-Id} is removed and, when
     * {@code userId} is non-null, re-set to the authenticated subject.
     */
    private ServerWebExchange withUserId(ServerWebExchange exchange, String userId) {
        ServerHttpRequest original = exchange.getRequest();
        HttpHeaders headers = new HttpHeaders();
        headers.addAll(original.getHeaders());
        headers.remove(USER_ID_HEADER);
        if (userId != null) {
            headers.set(USER_ID_HEADER, userId);
        }
        ServerHttpRequest mutated = new ServerHttpRequestDecorator(original) {
            @Override
            public HttpHeaders getHeaders() {
                return headers;
            }
        };
        return exchange.mutate().request(mutated).build();
    }

    @Override
    public int getOrder() {
        // Run after Spring Security populates the context but before the routing filters
        // (NettyRoutingFilter / ForwardRoutingFilter sit at LOWEST_PRECEDENCE).
        return Ordered.LOWEST_PRECEDENCE - 1;
    }
}
