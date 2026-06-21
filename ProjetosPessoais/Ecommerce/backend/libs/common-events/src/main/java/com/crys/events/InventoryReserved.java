package com.crys.events;

import java.util.UUID;

/** Fact: stock was reserved for the order. */
public record InventoryReserved(
        UUID orderId,
        String productSlug,
        int quantity
) {
}
