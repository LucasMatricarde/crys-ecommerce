package com.crys.events;

import java.time.Instant;
import java.util.UUID;

/**
 * Canonical wrapper for every domain event published to Kafka.
 * Producers MUST wrap payloads in an envelope; consumers read {@code type}
 * to route and {@code id} to deduplicate (idempotency — Inc 2).
 *
 * @param <T> the event payload type
 */
public record EventEnvelope<T>(
        UUID id,
        String type,
        Instant occurredAt,
        T payload
) {
    public static <T> EventEnvelope<T> of(String type, T payload) {
        return new EventEnvelope<>(UUID.randomUUID(), type, Instant.now(), payload);
    }
}
