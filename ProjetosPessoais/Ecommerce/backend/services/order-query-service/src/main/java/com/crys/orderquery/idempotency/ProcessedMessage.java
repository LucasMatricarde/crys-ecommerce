package com.crys.orderquery.idempotency;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Record of a consumed envelope id, so redeliveries can be skipped. Mongo-backed.
 * Collection name is service-scoped so consumer groups never share idempotency
 * markers (a shared collection would let one consumer starve another).
 */
@Document("order_query_processed_message")
public record ProcessedMessage(
        @Id String id,
        Instant processedAt
) {
}
