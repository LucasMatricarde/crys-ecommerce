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

    /**
     * W3C trace context captured when the row was written, so the relay can re-inject
     * it as Kafka headers and the saga trace survives the async hop. Null when no trace
     * was active at write time.
     */
    @Column(columnDefinition = "text")
    private String traceparent;

    @Column(columnDefinition = "text")
    private String tracestate;

    protected OutboxEvent() {
    }

    public OutboxEvent(UUID id, String topic, String key, String type, String payload, Instant occurredAt) {
        this(id, topic, key, type, payload, occurredAt, null, null);
    }

    public OutboxEvent(UUID id, String topic, String key, String type, String payload, Instant occurredAt,
                       String traceparent, String tracestate) {
        this.id = id;
        this.topic = topic;
        this.key = key;
        this.type = type;
        this.payload = payload;
        this.occurredAt = occurredAt;
        this.traceparent = traceparent;
        this.tracestate = tracestate;
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

    public String getTraceparent() {
        return traceparent;
    }

    public String getTracestate() {
        return tracestate;
    }

    public void markPublished(Instant when) {
        this.publishedAt = when;
    }
}
