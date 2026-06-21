package com.crys.events;

import java.util.UUID;

/** Fact: payment failed — triggers inventory release + order cancel. */
public record PaymentDeclined(
        UUID orderId,
        long amountCents,
        String reason
) {
}
