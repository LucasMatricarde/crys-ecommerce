package com.crys.orderquery.web;

import com.crys.orderquery.domain.OrderView;
import com.crys.orderquery.domain.OrderViewStatus;
import com.crys.orderquery.domain.TimelineEntry;

import java.time.Instant;
import java.util.List;

/** REST view of an {@link OrderView}. */
public record OrderViewResponse(
        String orderId,
        String productSlug,
        int quantity,
        long amountCents,
        OrderViewStatus status,
        String reason,
        Instant createdAt,
        Instant updatedAt,
        List<TimelineEntry> timeline
) {
    public static OrderViewResponse from(OrderView v) {
        return new OrderViewResponse(
                v.getOrderId(),
                v.getProductSlug(),
                v.getQuantity(),
                v.getAmountCents(),
                v.getStatus(),
                v.getReason(),
                v.getCreatedAt(),
                v.getUpdatedAt(),
                v.getTimeline());
    }
}
