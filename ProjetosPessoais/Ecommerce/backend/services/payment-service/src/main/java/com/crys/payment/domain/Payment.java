package com.crys.payment.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/** Payment record per order (keyed by orderId — one charge attempt per order). */
@Entity
@Table(name = "payment")
public class Payment {

    @Id
    private UUID orderId;

    private long amountCents;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private Instant processedAt;

    protected Payment() {
    }

    public Payment(UUID orderId, long amountCents, PaymentStatus status) {
        this.orderId = orderId;
        this.amountCents = amountCents;
        this.status = status;
        this.processedAt = Instant.now();
    }

    public UUID getOrderId() {
        return orderId;
    }

    public long getAmountCents() {
        return amountCents;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public Instant getProcessedAt() {
        return processedAt;
    }
}
