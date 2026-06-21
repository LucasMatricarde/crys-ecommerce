package com.crys.orderquery.messaging;

import com.crys.events.EventTypes;
import com.crys.events.InventoryRejected;
import com.crys.events.InventoryReserved;
import com.crys.events.OrderCancelled;
import com.crys.events.OrderConfirmed;
import com.crys.events.OrderCreated;
import com.crys.events.PaymentApproved;
import com.crys.events.PaymentDeclined;
import com.crys.events.Topics;
import com.crys.orderquery.idempotency.MongoIdempotencyGuard;
import com.crys.orderquery.service.OrderViewProjector;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumes the saga's facts (order/inventory/payment) and projects them onto the
 * read model. One consumer group so the read side scales independently of the
 * write side. Each envelope is processed at most once via the idempotency guard.
 */
@Component
public class OrderViewListener {

    private final EnvelopeCodec codec;
    private final MongoIdempotencyGuard idempotency;
    private final OrderViewProjector projector;

    public OrderViewListener(EnvelopeCodec codec, MongoIdempotencyGuard idempotency,
                             OrderViewProjector projector) {
        this.codec = codec;
        this.idempotency = idempotency;
        this.projector = projector;
    }

    @KafkaListener(
            topics = {Topics.ORDER_EVENTS, Topics.INVENTORY_EVENTS, Topics.PAYMENT_EVENTS},
            groupId = "order-query-service")
    public void onEvent(String message) {
        EnvelopeCodec.Incoming in = codec.parse(message);
        if (!idempotency.firstSeen(in.id())) {
            return;
        }
        switch (in.type()) {
            case EventTypes.ORDER_CREATED ->
                    projector.onOrderCreated(codec.payload(in, OrderCreated.class));
            case EventTypes.INVENTORY_RESERVED ->
                    projector.onInventoryReserved(codec.payload(in, InventoryReserved.class));
            case EventTypes.INVENTORY_REJECTED ->
                    projector.onInventoryRejected(codec.payload(in, InventoryRejected.class));
            case EventTypes.PAYMENT_APPROVED ->
                    projector.onPaymentApproved(codec.payload(in, PaymentApproved.class));
            case EventTypes.PAYMENT_DECLINED ->
                    projector.onPaymentDeclined(codec.payload(in, PaymentDeclined.class));
            case EventTypes.ORDER_CONFIRMED ->
                    projector.onOrderConfirmed(codec.payload(in, OrderConfirmed.class));
            case EventTypes.ORDER_CANCELLED ->
                    projector.onOrderCancelled(codec.payload(in, OrderCancelled.class));
            default -> { /* ignore commands / unrelated types */ }
        }
    }
}
