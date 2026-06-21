package com.crys.messaging.outbox;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Polls the outbox and publishes unsent rows to Kafka. A row is marked
 * {@code publishedAt} only after the broker acknowledges, so a send failure leaves
 * it for the next tick (at-least-once delivery — consumers are idempotent).
 */
@Component
public class OutboxRelay {

    private static final Logger log = LoggerFactory.getLogger(OutboxRelay.class);

    private final OutboxRepository repository;
    private final KafkaTemplate<String, String> kafka;

    public OutboxRelay(OutboxRepository repository, KafkaTemplate<String, String> kafka) {
        this.repository = repository;
        this.kafka = kafka;
    }

    @Scheduled(fixedDelayString = "${crys.outbox.relay-delay-ms:1000}")
    @Transactional
    public void flush() {
        var pending = repository.findTop100ByPublishedAtIsNullOrderByOccurredAtAsc();
        for (OutboxEvent event : pending) {
            try {
                kafka.send(event.getTopic(), event.getKey(), event.getPayload()).get();
                event.markPublished(Instant.now());
            } catch (Exception e) {
                // Leave publishedAt null; retried next tick. Stop the batch to preserve order.
                log.warn("Outbox publish failed for {} ({}), will retry", event.getId(), event.getType(), e);
                break;
            }
        }
    }
}
