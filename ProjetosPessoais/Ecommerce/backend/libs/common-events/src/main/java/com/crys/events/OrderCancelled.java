package com.crys.events;

import java.util.UUID;

/**
 * Fact: the saga concluded as a failure — order is CANCELLED.
 * {@code reason} is "inventory rejected" or "payment declined". Emitted by order-service.
 */
public record OrderCancelled(
        UUID orderId,
        String reason
) {
}
