package com.crys.orderquery.domain;

import java.time.Instant;

/** One step in an order's saga timeline (created / reserved / payment / finished). */
public record TimelineEntry(
        String step,
        Instant at
) {
    public static TimelineEntry of(String step) {
        return new TimelineEntry(step, Instant.now());
    }
}
