package com.crys.notification.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * A customer notification generated from an order event. Delivery is mocked
 * (persisted + logged); {@code channel} is always "mock" in this increment.
 */
@Document("notification")
public record Notification(
        @Id String id,
        @Indexed String orderId,
        NotificationType type,
        String channel,
        String message,
        Instant createdAt
) {
    public static Notification mock(String orderId, NotificationType type, String message) {
        return new Notification(null, orderId, type, "mock", message, Instant.now());
    }
}
