package com.crys.messaging.outbox;

import com.crys.events.EventEnvelope;
import com.crys.messaging.EnvelopeCodec;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Appends an event to the outbox. {@link Propagation#MANDATORY} forces it to run
 * inside the caller's transaction — the whole point of the pattern: the domain
 * write and the event insert commit (or roll back) together.
 */
@Component
public class OutboxWriter {

    private final OutboxRepository repository;
    private final EnvelopeCodec codec;

    public OutboxWriter(OutboxRepository repository, EnvelopeCodec codec) {
        this.repository = repository;
        this.codec = codec;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void append(String topic, String key, EventEnvelope<?> envelope) {
        repository.save(new OutboxEvent(
                envelope.id(),
                topic,
                key,
                envelope.type(),
                codec.serialize(envelope),
                envelope.occurredAt()));
    }
}
