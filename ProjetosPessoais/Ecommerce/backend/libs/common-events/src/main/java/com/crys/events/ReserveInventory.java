package com.crys.events;

import java.util.UUID;

/** Command: reserve stock for an order. */
public record ReserveInventory(
        UUID orderId,
        String productSlug,
        int quantity
) {
}
