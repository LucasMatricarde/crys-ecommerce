package com.crys.notification.messaging;

import com.crys.events.EventTypes;
import com.crys.events.OrderCancelled;
import com.crys.events.OrderConfirmed;
import com.crys.events.OrderCreated;
import com.crys.events.Topics;
import com.crys.notification.idempotency.MongoIdempotencyGuard;
import com.crys.notification.service.NotificationService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumes order-lifecycle facts and turns them into customer notifications. Its own
 * consumer group, so it fans out independently of the read-model consumer. Each
 * envelope is processed at most once via the idempotency guard.
 */
@Component
public class NotificationListener {

    private final EnvelopeCodec codec;
    private final MongoIdempotencyGuard idempotency;
    private final NotificationService notifications;

    public NotificationListener(EnvelopeCodec codec, MongoIdempotencyGuard idempotency,
                                NotificationService notifications) {
        this.codec = codec;
        this.idempotency = idempotency;
        this.notifications = notifications;
    }

    @KafkaListener(topics = Topics.ORDER_EVENTS, groupId = "notification-service")
    public void onOrderEvent(String message) {
        EnvelopeCodec.Incoming in = codec.parse(message);
        if (!idempotency.firstSeen(in.id())) {
            return;
        }
        switch (in.type()) {
            case EventTypes.ORDER_CREATED -> {
                OrderCreated e = codec.payload(in, OrderCreated.class);
                notifications.orderReceived(e.orderId().toString());
            }
            case EventTypes.ORDER_CONFIRMED -> {
                OrderConfirmed e = codec.payload(in, OrderConfirmed.class);
                notifications.orderConfirmed(e.orderId().toString());
            }
            case EventTypes.ORDER_CANCELLED -> {
                OrderCancelled e = codec.payload(in, OrderCancelled.class);
                notifications.orderCancelled(e.orderId().toString(), e.reason());
            }
            default -> { /* ignore other order.events types */ }
        }
    }
}
