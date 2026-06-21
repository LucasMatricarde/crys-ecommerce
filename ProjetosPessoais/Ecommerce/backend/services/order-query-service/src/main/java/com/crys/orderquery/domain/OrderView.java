package com.crys.orderquery.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Denormalized, query-optimized read model of an order — the CQRS read side.
 * Built by consuming order/inventory/payment events; eventually consistent with
 * order-service's write model. The {@code timeline} embeds the saga steps so a
 * single-document read tells the whole story (no joins).
 */
@Document("order_view")
public class OrderView {

    @Id
    private String orderId;

    private String productSlug;
    private int quantity;
    private long amountCents;

    @Indexed
    private OrderViewStatus status;

    private String reason;
    private Instant createdAt;
    private Instant updatedAt;
    private List<TimelineEntry> timeline = new ArrayList<>();

    protected OrderView() {
    }

    public OrderView(String orderId) {
        this.orderId = orderId;
        this.status = OrderViewStatus.PENDING;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public OrderView status(OrderViewStatus status) {
        this.status = status;
        return touch();
    }

    public OrderView reason(String reason) {
        this.reason = reason;
        return touch();
    }

    public OrderView details(String productSlug, int quantity, long amountCents) {
        this.productSlug = productSlug;
        this.quantity = quantity;
        this.amountCents = amountCents;
        return touch();
    }

    public OrderView addStep(String step) {
        this.timeline.add(TimelineEntry.of(step));
        return touch();
    }

    private OrderView touch() {
        this.updatedAt = Instant.now();
        return this;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getProductSlug() {
        return productSlug;
    }

    public int getQuantity() {
        return quantity;
    }

    public long getAmountCents() {
        return amountCents;
    }

    public OrderViewStatus getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public List<TimelineEntry> getTimeline() {
        return timeline;
    }
}
