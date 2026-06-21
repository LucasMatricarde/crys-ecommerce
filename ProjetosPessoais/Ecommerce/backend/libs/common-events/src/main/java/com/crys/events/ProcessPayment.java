package com.crys.events;

import java.util.UUID;

/** Command: charge the customer for an order. */
public record ProcessPayment(
        UUID orderId,
        long amountCents
) {
}
