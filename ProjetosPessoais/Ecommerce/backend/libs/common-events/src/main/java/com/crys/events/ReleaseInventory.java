package com.crys.events;

import java.util.UUID;

/** Command (compensation): release previously reserved stock. */
public record ReleaseInventory(
        UUID orderId,
        String productSlug,
        int quantity
) {
}
