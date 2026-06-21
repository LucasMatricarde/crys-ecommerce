package com.crys.events;

import java.util.UUID;

/** Fact: stock could not be reserved (out of stock / unknown product). */
public record InventoryRejected(
        UUID orderId,
        String productSlug,
        int quantity,
        String reason
) {
}
