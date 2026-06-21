package com.crys.payment.saga;

import com.crys.events.EventEnvelope;
import com.crys.events.EventTypes;
import com.crys.events.ProcessPayment;
import com.crys.events.Topics;
import com.crys.payment.AbstractSagaIntegrationTest;
import com.crys.messaging.EnvelopeCodec;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class PaymentListenerIT extends AbstractSagaIntegrationTest {

    @Autowired
    KafkaTemplate<String, String> kafka;

    @Autowired
    EnvelopeCodec codec;

    @Test
    void approvesBelowThreshold() {
        UUID orderId = UUID.randomUUID();
        sendProcess(orderId, 18990L); // R$ 189,90 < default threshold

        assertThat(sawEvent(Topics.PAYMENT_EVENTS,
                json -> json.contains(EventTypes.PAYMENT_APPROVED) && json.contains(orderId.toString()),
                Duration.ofSeconds(20))).isTrue();
    }

    @Test
    void declinesAtOrAboveThreshold() {
        UUID orderId = UUID.randomUUID();
        sendProcess(orderId, 2_000_000L); // above default 1,000,000 threshold

        assertThat(sawEvent(Topics.PAYMENT_EVENTS,
                json -> json.contains(EventTypes.PAYMENT_DECLINED) && json.contains(orderId.toString()),
                Duration.ofSeconds(20))).isTrue();
    }

    private void sendProcess(UUID orderId, long amountCents) {
        EventEnvelope<ProcessPayment> env = EventEnvelope.of(
                EventTypes.PROCESS_PAYMENT, new ProcessPayment(orderId, amountCents));
        kafka.send(Topics.PAYMENT_COMMANDS, orderId.toString(), codec.serialize(env));
    }
}
