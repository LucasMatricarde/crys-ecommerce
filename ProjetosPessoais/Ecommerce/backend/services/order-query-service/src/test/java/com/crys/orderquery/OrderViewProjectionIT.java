package com.crys.orderquery;

import com.crys.events.EventEnvelope;
import com.crys.events.EventTypes;
import com.crys.events.OrderConfirmed;
import com.crys.events.OrderCreated;
import com.crys.events.Topics;
import com.crys.orderquery.domain.OrderView;
import com.crys.orderquery.domain.OrderViewStatus;
import com.crys.orderquery.domain.OrderViewRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.Duration;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

class OrderViewProjectionIT extends AbstractProjectionIntegrationTest {

    @Autowired
    OrderViewRepository views;

    @Autowired
    KafkaTemplate<String, String> kafka;

    @Autowired
    ObjectMapper mapper;

    @BeforeEach
    void clean() {
        views.deleteAll();
    }

    @Test
    void projectsOrderToConfirmedWithTimeline() {
        UUID orderId = UUID.randomUUID();

        publish(Topics.ORDER_EVENTS, EventEnvelope.of(EventTypes.ORDER_CREATED,
                new OrderCreated(orderId, "rosin-premium", 1, 18990)));
        publish(Topics.ORDER_EVENTS, EventEnvelope.of(EventTypes.ORDER_CONFIRMED,
                new OrderConfirmed(orderId)));

        await().atMost(Duration.ofSeconds(20)).untilAsserted(() -> {
            OrderView view = views.findById(orderId.toString()).orElse(null);
            assertThat(view).isNotNull();
            assertThat(view.getStatus()).isEqualTo(OrderViewStatus.CONFIRMED);
            assertThat(view.getProductSlug()).isEqualTo("rosin-premium");
            assertThat(view.getTimeline()).extracting("step").contains("created", "confirmed");
        });
    }

    @Test
    void redeliveryIsNoOp() {
        UUID orderId = UUID.randomUUID();

        publish(Topics.ORDER_EVENTS, EventEnvelope.of(EventTypes.ORDER_CREATED,
                new OrderCreated(orderId, "shatter-cristal", 2, 24000)));

        // Same envelope id delivered twice — the second must not append a duplicate step.
        EventEnvelope<OrderConfirmed> confirmed =
                EventEnvelope.of(EventTypes.ORDER_CONFIRMED, new OrderConfirmed(orderId));
        publish(Topics.ORDER_EVENTS, confirmed);
        publish(Topics.ORDER_EVENTS, confirmed);

        await().atMost(Duration.ofSeconds(20)).untilAsserted(() -> {
            OrderView view = views.findById(orderId.toString()).orElse(null);
            assertThat(view).isNotNull();
            assertThat(view.getStatus()).isEqualTo(OrderViewStatus.CONFIRMED);
            assertThat(view.getTimeline()).filteredOn(t -> t.step().equals("confirmed")).hasSize(1);
        });
    }

    private void publish(String topic, EventEnvelope<?> envelope) {
        try {
            kafka.send(topic, envelope.payload() == null ? null : envelope.id().toString(),
                    mapper.writeValueAsString(envelope));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
