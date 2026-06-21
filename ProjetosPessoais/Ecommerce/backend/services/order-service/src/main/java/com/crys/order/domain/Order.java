package com.crys.order.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * The order aggregate. {@code id} is assigned at construction so the saga can
 * reference it (and write the OrderCreated outbox row) within the same tx that
 * persists the order. Status walks PENDING → CONFIRMED|CANCELLED, driven by the
 * orchestrator reacting to inventory/payment events.
 */
@Entity
@Table(name = "orders")
public class Order {

    @Id
    private UUID id;

    private String productSlug;

    private int quantity;

    private long amountCents;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(updatable = false)
    private Instant createdAt;

    protected Order() {
    }

    public Order(String productSlug, int quantity, long amountCents) {
        this.id = UUID.randomUUID();
        this.productSlug = productSlug;
        this.quantity = quantity;
        this.amountCents = amountCents;
        this.status = OrderStatus.PENDING;
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
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

    public OrderStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void confirm() {
        this.status = OrderStatus.CONFIRMED;
    }

    public void cancel() {
        this.status = OrderStatus.CANCELLED;
    }
}
