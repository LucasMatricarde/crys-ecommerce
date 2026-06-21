package com.crys.events;

import java.util.UUID;

/** Fact: the saga concluded successfully — order is CONFIRMED. Emitted by order-service. */
public record OrderConfirmed(
        UUID orderId
) {
}
