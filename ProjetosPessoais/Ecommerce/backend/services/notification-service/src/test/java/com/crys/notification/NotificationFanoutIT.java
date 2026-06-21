package com.crys.notification;

import com.crys.events.EventEnvelope;
import com.crys.events.EventTypes;
import com.crys.events.OrderCancelled;
import com.crys.events.OrderConfirmed;
import com.crys.events.OrderCreated;
import com.crys.events.Topics;
import com.crys.notification.domain.Notification;
import com.crys.notification.domain.NotificationRepository;
import com.crys.notification.domain.NotificationType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

class NotificationFanoutIT extends AbstractNotificationIntegrationTest {

    @Autowired
    NotificationRepository notifications;

    @Autowired
    KafkaTemplate<String, String> kafka;

    @Autowired
    ObjectMapper mapper;

    @BeforeEach
    void clean() {
        notifications.deleteAll();
    }

    @Test
    void emitsReceivedAndConfirmedNotifications() {
        UUID orderId = UUID.randomUUID();

        publish(EventEnvelope.of(EventTypes.ORDER_CREATED,
                new OrderCreated(orderId, "rosin-premium", 1, 18990)));
        publish(EventEnvelope.of(EventTypes.ORDER_CONFIRMED, new OrderConfirmed(orderId)));

        await().atMost(Duration.ofSeconds(20)).untilAsserted(() -> {
            List<Notification> docs = notifications.findByOrderIdOrderByCreatedAtAsc(orderId.toString());
            assertThat(docs).extracting(Notification::type)
                    .containsExactly(NotificationType.ORDER_RECEIVED, NotificationType.ORDER_CONFIRMED);
            assertThat(docs).allSatisfy(n -> assertThat(n.channel()).isEqualTo("mock"));
        });
    }

    @Test
    void cancelNotificationCarriesReason() {
        UUID orderId = UUID.randomUUID();

        publish(EventEnvelope.of(EventTypes.ORDER_CANCELLED,
                new OrderCancelled(orderId, "payment declined")));

        await().atMost(Duration.ofSeconds(20)).untilAsserted(() -> {
            List<Notification> docs = notifications.findByOrderIdOrderByCreatedAtAsc(orderId.toString());
            assertThat(docs).hasSize(1);
            assertThat(docs.get(0).type()).isEqualTo(NotificationType.ORDER_CANCELLED);
            assertThat(docs.get(0).message()).contains("payment declined");
        });
    }

    @Test
    void redeliveryIsNoOp() {
        UUID orderId = UUID.randomUUID();

        EventEnvelope<OrderCreated> created = EventEnvelope.of(EventTypes.ORDER_CREATED,
                new OrderCreated(orderId, "shatter-cristal", 1, 12000));
        publish(created);
        publish(created);

        await().atMost(Duration.ofSeconds(20)).untilAsserted(() ->
                assertThat(notifications.findByOrderIdOrderByCreatedAtAsc(orderId.toString())).hasSize(1));
    }

    private void publish(EventEnvelope<?> envelope) {
        try {
            kafka.send(Topics.ORDER_EVENTS, envelope.id().toString(), mapper.writeValueAsString(envelope));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
