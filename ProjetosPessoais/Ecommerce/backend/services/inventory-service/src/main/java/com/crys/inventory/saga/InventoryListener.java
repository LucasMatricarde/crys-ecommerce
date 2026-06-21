package com.crys.inventory.saga;

import com.crys.events.EventEnvelope;
import com.crys.events.EventTypes;
import com.crys.events.InventoryRejected;
import com.crys.events.InventoryReserved;
import com.crys.events.ReleaseInventory;
import com.crys.events.ReserveInventory;
import com.crys.events.Topics;
import com.crys.inventory.domain.StockItem;
import com.crys.inventory.domain.StockRepository;
import com.crys.messaging.EnvelopeCodec;
import com.crys.messaging.idempotency.IdempotencyGuard;
import com.crys.messaging.outbox.OutboxWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Reacts to inventory commands from the orchestrator. Reserve either succeeds
 * (emit InventoryReserved) or fails for unknown/out-of-stock products (emit
 * InventoryRejected). Release is a compensation with no event. Stock change and
 * outbox event commit in one tx; redeliveries are skipped via the idempotency guard.
 */
@Component
public class InventoryListener {

    private static final Logger log = LoggerFactory.getLogger(InventoryListener.class);

    private final StockRepository stock;
    private final OutboxWriter outbox;
    private final IdempotencyGuard idempotency;
    private final EnvelopeCodec codec;

    public InventoryListener(StockRepository stock, OutboxWriter outbox,
                             IdempotencyGuard idempotency, EnvelopeCodec codec) {
        this.stock = stock;
        this.outbox = outbox;
        this.idempotency = idempotency;
        this.codec = codec;
    }

    @KafkaListener(topics = Topics.INVENTORY_COMMANDS, groupId = "inventory-service")
    @Transactional
    public void onCommand(String message) {
        EnvelopeCodec.Incoming in = codec.parse(message);
        if (!idempotency.firstSeen(in.id())) {
            return;
        }
        switch (in.type()) {
            case EventTypes.RESERVE_INVENTORY -> reserve(codec.payload(in, ReserveInventory.class));
            case EventTypes.RELEASE_INVENTORY -> release(codec.payload(in, ReleaseInventory.class));
            default -> { /* ignore */ }
        }
    }

    private void reserve(ReserveInventory cmd) {
        Optional<StockItem> item = stock.findByProductSlug(cmd.productSlug());
        if (item.isEmpty() || !item.get().canReserve(cmd.quantity())) {
            String reason = item.isEmpty() ? "produto desconhecido" : "estoque insuficiente";
            emit(Topics.INVENTORY_EVENTS, cmd.orderId().toString(), EventTypes.INVENTORY_REJECTED,
                    new InventoryRejected(cmd.orderId(), cmd.productSlug(), cmd.quantity(), reason));
            log.info("Reserve rejected for order {} ({}): {}", cmd.orderId(), cmd.productSlug(), reason);
            return;
        }
        StockItem reserved = item.get();
        reserved.reserve(cmd.quantity());
        stock.save(reserved);
        emit(Topics.INVENTORY_EVENTS, cmd.orderId().toString(), EventTypes.INVENTORY_RESERVED,
                new InventoryReserved(cmd.orderId(), cmd.productSlug(), cmd.quantity()));
        log.info("Reserved {} x {} for order {}", cmd.quantity(), cmd.productSlug(), cmd.orderId());
    }

    private void release(ReleaseInventory cmd) {
        stock.findByProductSlug(cmd.productSlug()).ifPresent(item -> {
            item.release(cmd.quantity());
            stock.save(item);
            log.info("Released {} x {} for order {}", cmd.quantity(), cmd.productSlug(), cmd.orderId());
        });
    }

    private <T> void emit(String topic, String key, String type, T payload) {
        outbox.append(topic, key, EventEnvelope.of(type, payload));
    }
}
