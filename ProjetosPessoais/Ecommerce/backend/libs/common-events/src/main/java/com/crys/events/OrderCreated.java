package com.crys.events;

import java.util.UUID;

/** Fact: an order was placed (PENDING). Kicks off the saga. */
public record OrderCreated(
        UUID orderId,
        String productSlug,
        int quantity,
        long amountCents
) {
}
