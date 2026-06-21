package com.crys.messaging.idempotency;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/** Record of a consumed message id, so redeliveries can be skipped. */
@Entity
@Table(name = "processed_message")
public class ProcessedMessage {

    @Id
    private UUID messageId;

    private Instant processedAt;

    protected ProcessedMessage() {
    }

    public ProcessedMessage(UUID messageId, Instant processedAt) {
        this.messageId = messageId;
        this.processedAt = processedAt;
    }

    public UUID getMessageId() {
        return messageId;
    }

    public Instant getProcessedAt() {
        return processedAt;
    }
}
