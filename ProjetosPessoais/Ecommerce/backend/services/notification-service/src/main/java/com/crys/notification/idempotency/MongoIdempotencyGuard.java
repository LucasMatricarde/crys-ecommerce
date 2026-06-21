package com.crys.notification.idempotency;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

/**
 * Guards the consumer against duplicate deliveries. {@link #firstSeen(UUID)} returns
 * {@code true} the first time an envelope id is seen and {@code false} for any
 * redelivery. Uses Mongo {@code insert} (not save) so a re-seen id collides on the
 * unique {@code _id} and is reported as a duplicate — no JPA needed.
 */
@Component
public class MongoIdempotencyGuard {

    private final ProcessedMessageRepository repository;

    public MongoIdempotencyGuard(ProcessedMessageRepository repository) {
        this.repository = repository;
    }

    public boolean firstSeen(UUID messageId) {
        String id = messageId.toString();
        if (repository.existsById(id)) {
            return false;
        }
        try {
            repository.insert(new ProcessedMessage(id, Instant.now()));
            return true;
        } catch (DuplicateKeyException duplicate) {
            return false;
        }
    }
}
