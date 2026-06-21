package com.crys.order.saga;

import com.crys.events.EventEnvelope;
import com.crys.events.EventTypes;
import com.crys.events.InventoryReserved;
import com.crys.events.OrderCancelled;
import com.crys.events.OrderConfirmed;
import com.crys.events.OrderCreated;
import com.crys.events.ProcessPayment;
import com.crys.events.ReleaseInventory;
import com.crys.events.ReserveInventory;
import com.crys.events.Topics;
import com.crys.order.domain.Order;
import com.crys.order.domain.OrderRepository;
import com.crys.messaging.EnvelopeCodec;
import com.crys.messaging.idempotency.IdempotencyGuard;
import com.crys.messaging.outbox.OutboxWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * The saga orchestrator. It owns the order's lifecycle, reacting to facts from
 * inventory and payment and issuing the next command (or a compensation). Every
 * handler is transactional: idempotency marker + state change + any outbox command
 * commit atomically, so the orchestrator can't lose or double-apply a step.
 */
@Component
public class OrderSaga {

    private static final Logger log = LoggerFactory.getLogger(OrderSaga.class);

    private final OrderRepository orders;
    private final OutboxWriter outbox;
    private final IdempotencyGuard idempotency;
    private final EnvelopeCodec codec;

    public OrderSaga(OrderRepository orders, OutboxWriter outbox,
                     IdempotencyGuard idempotency, EnvelopeCodec codec) {
        this.orders = orders;
        this.outbox = outbox;
        this.idempotency = idempotency;
        this.codec = codec;
    }

    /** OrderCreated → command inventory to reserve stock. */
    @KafkaListener(topics = Topics.ORDER_EVENTS, groupId = "order-service")
    @Transactional
    public void onOrderEvents(String message) {
        EnvelopeCodec.Incoming in = codec.parse(message);
        if (!idempotency.firstSeen(in.id())) {
            return;
        }
        if (EventTypes.ORDER_CREATED.equals(in.type())) {
            OrderCreated e = codec.payload(in, OrderCreated.class);
            send(Topics.INVENTORY_COMMANDS, e.orderId(), EventTypes.RESERVE_INVENTORY,
                    new ReserveInventory(e.orderId(), e.productSlug(), e.quantity()));
        }
    }

    /** InventoryReserved → request payment. InventoryRejected → cancel. */
    @KafkaListener(topics = Topics.INVENTORY_EVENTS, groupId = "order-service")
    @Transactional
    public void onInventoryEvents(String message) {
        EnvelopeCodec.Incoming in = codec.parse(message);
        if (!idempotency.firstSeen(in.id())) {
            return;
        }
        switch (in.type()) {
            case EventTypes.INVENTORY_RESERVED -> {
                InventoryReserved e = codec.payload(in, InventoryReserved.class);
                Order order = require(e.orderId());
                send(Topics.PAYMENT_COMMANDS, order.getId(), EventTypes.PROCESS_PAYMENT,
                        new ProcessPayment(order.getId(), order.getAmountCents()));
            }
            case EventTypes.INVENTORY_REJECTED -> {
                UUID orderId = orderIdOf(in);
                Order order = require(orderId);
                order.cancel();
                emitCancelled(orderId, "inventory rejected");
                log.info("Order {} cancelled — inventory rejected", orderId);
            }
            default -> { /* ignore */ }
        }
    }

    /** PaymentApproved → confirm. PaymentDeclined → release stock + cancel. */
    @KafkaListener(topics = Topics.PAYMENT_EVENTS, groupId = "order-service")
    @Transactional
    public void onPaymentEvents(String message) {
        EnvelopeCodec.Incoming in = codec.parse(message);
        if (!idempotency.firstSeen(in.id())) {
            return;
        }
        switch (in.type()) {
            case EventTypes.PAYMENT_APPROVED -> {
                Order order = require(orderIdOf(in));
                order.confirm();
                emitConfirmed(order.getId());
                log.info("Order {} confirmed", order.getId());
            }
            case EventTypes.PAYMENT_DECLINED -> {
                Order order = require(orderIdOf(in));
                send(Topics.INVENTORY_COMMANDS, order.getId(), EventTypes.RELEASE_INVENTORY,
                        new ReleaseInventory(order.getId(), order.getProductSlug(), order.getQuantity()));
                order.cancel();
                emitCancelled(order.getId(), "payment declined");
                log.info("Order {} cancelled — payment declined; releasing stock", order.getId());
            }
            default -> { /* ignore */ }
        }
    }

    private <T> void send(String topic, UUID orderId, String type, T payload) {
        outbox.append(topic, orderId.toString(), EventEnvelope.of(type, payload));
    }

    /**
     * Emits the terminal order-lifecycle fact to {@code order.events} via the outbox,
     * in the same tx as the confirm/cancel state write — so the read side and
     * notifications can react. Reuses the existing relay; no new infra.
     */
    private void emitConfirmed(UUID orderId) {
        outbox.append(Topics.ORDER_EVENTS, orderId.toString(),
                EventEnvelope.of(EventTypes.ORDER_CONFIRMED, new OrderConfirmed(orderId)));
    }

    private void emitCancelled(UUID orderId, String reason) {
        outbox.append(Topics.ORDER_EVENTS, orderId.toString(),
                EventEnvelope.of(EventTypes.ORDER_CANCELLED, new OrderCancelled(orderId, reason)));
    }

    private UUID orderIdOf(EnvelopeCodec.Incoming in) {
        return UUID.fromString(in.payload().get("orderId").asText());
    }

    private Order require(UUID orderId) {
        return orders.findById(orderId)
                .orElseThrow(() -> new IllegalStateException("Unknown order " + orderId));
    }
}
