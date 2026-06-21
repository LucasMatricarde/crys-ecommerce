package com.crys.messaging.outbox;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * A row in the transactional outbox. Written in the same DB transaction as the
 * domain change, then published to Kafka by {@link OutboxRelay} and stamped
 * {@code publishedAt}. {@code id} is the {@code EventEnvelope} id — consumers use
 * it for idempotency.
 */
@Entity
@Table(name = "outbox")
public class OutboxEvent {

    @Id
    private UUID id;

    private String topic;

    @Column(name = "msg_key")
    private String key;

    private String type;

    @Column(columnDefinition = "text")
    private String payload;

    private Instant occurredAt;

    private Instant publishedAt;

    protected OutboxEvent() {
    }

    public OutboxEvent(UUID id, String topic, String key, String type, String payload, Instant occurredAt) {
        this.id = id;
        this.topic = topic;
        this.key = key;
        this.type = type;
        this.payload = payload;
        this.occurredAt = occurredAt;
    }

    public UUID getId() {
        return id;
    }

    public String getTopic() {
        return topic;
    }

    public String getKey() {
        return key;
    }

    public String getType() {
        return type;
    }

    public String getPayload() {
        return payload;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }

    public Instant getPublishedAt() {
        return publishedAt;
    }

    public void markPublished(Instant when) {
        this.publishedAt = when;
    }
}
