package com.crys.messaging.idempotency;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Guards a consumer against duplicate deliveries. Call {@link #firstSeen(UUID)}
 * at the top of the (transactional) handler: it returns {@code true} the first
 * time a message id is seen and {@code false} for any redelivery, so the handler
 * can short-circuit. Runs in the caller's tx so the marker and the side effects
 * commit atomically.
 */
@Component
public class IdempotencyGuard {

    private final ProcessedMessageRepository repository;

    public IdempotencyGuard(ProcessedMessageRepository repository) {
        this.repository = repository;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public boolean firstSeen(UUID messageId) {
        if (repository.existsById(messageId)) {
            return false;
        }
        try {
            repository.saveAndFlush(new ProcessedMessage(messageId, Instant.now()));
            return true;
        } catch (DataIntegrityViolationException duplicate) {
            return false;
        }
    }
}
