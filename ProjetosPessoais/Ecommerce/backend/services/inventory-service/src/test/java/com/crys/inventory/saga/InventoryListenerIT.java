package com.crys.inventory.saga;

import com.crys.events.EventEnvelope;
import com.crys.events.EventTypes;
import com.crys.events.ReserveInventory;
import com.crys.events.Topics;
import com.crys.inventory.AbstractSagaIntegrationTest;
import com.crys.inventory.domain.StockItem;
import com.crys.inventory.domain.StockRepository;
import com.crys.messaging.EnvelopeCodec;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

class InventoryListenerIT extends AbstractSagaIntegrationTest {

    @Autowired
    StockRepository stock;

    @Autowired
    KafkaTemplate<String, String> kafka;

    @Autowired
    EnvelopeCodec codec;

    @BeforeEach
    void seed() {
        stock.deleteAll();
        stock.save(new StockItem("rosin-premium", 5));
        stock.save(new StockItem("shatter-cristal", 0));
    }

    @Test
    void reservesStockAndEmitsReserved() {
        UUID orderId = UUID.randomUUID();
        sendReserve(orderId, "rosin-premium", 2);

        await().atMost(Duration.ofSeconds(20)).untilAsserted(() ->
                assertThat(stock.findByProductSlug("rosin-premium").orElseThrow().getAvailable()).isEqualTo(3));

        assertThat(sawEvent(Topics.INVENTORY_EVENTS,
                json -> json.contains(EventTypes.INVENTORY_RESERVED) && json.contains(orderId.toString()),
                Duration.ofSeconds(10))).isTrue();
    }

    @Test
    void rejectsWhenOutOfStock() {
        UUID orderId = UUID.randomUUID();
        sendReserve(orderId, "shatter-cristal", 1);

        assertThat(sawEvent(Topics.INVENTORY_EVENTS,
                json -> json.contains(EventTypes.INVENTORY_REJECTED) && json.contains(orderId.toString()),
                Duration.ofSeconds(20))).isTrue();
        assertThat(stock.findByProductSlug("shatter-cristal").orElseThrow().getAvailable()).isZero();
    }

    private void sendReserve(UUID orderId, String slug, int qty) {
        EventEnvelope<ReserveInventory> env = EventEnvelope.of(
                EventTypes.RESERVE_INVENTORY, new ReserveInventory(orderId, slug, qty));
        kafka.send(Topics.INVENTORY_COMMANDS, orderId.toString(), codec.serialize(env));
    }
}
