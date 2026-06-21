package com.crys.events;

import java.util.UUID;

/** Fact: payment succeeded. */
public record PaymentApproved(
        UUID orderId,
        long amountCents
) {
}
