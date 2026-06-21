package com.crys.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;

@Configuration
public class RateLimiterConfig {

    /**
     * Rate-limit per client IP. Falls back to "unknown" when the remote address
     * isn't resolvable (so a missing address doesn't bypass the limiter).
     */
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            InetSocketAddress address = exchange.getRequest().getRemoteAddress();
            String key = address != null ? address.getAddress().getHostAddress() : "unknown";
            return Mono.just(key);
        };
    }
}
