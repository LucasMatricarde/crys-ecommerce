package com.crys.messaging.outbox;

import com.crys.events.EventEnvelope;
import com.crys.messaging.EnvelopeCodec;
import io.micrometer.tracing.TraceContext;
import io.micrometer.tracing.Tracer;
import io.micrometer.tracing.propagation.Propagator;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * Appends an event to the outbox. {@link Propagation#MANDATORY} forces it to run
 * inside the caller's transaction — the whole point of the pattern: the domain
 * write and the event insert commit (or roll back) together.
 *
 * <p>If a trace is active, the W3C context is captured here and persisted on the row.
 * The relay publishes later on a scheduler thread (outside this trace), so the context
 * must travel with the event rather than relying on auto-instrumentation.
 */
@Component
public class OutboxWriter {

    private final OutboxRepository repository;
    private final EnvelopeCodec codec;
    private final ObjectProvider<Tracer> tracer;
    private final ObjectProvider<Propagator> propagator;

    public OutboxWriter(OutboxRepository repository, EnvelopeCodec codec,
                        ObjectProvider<Tracer> tracer, ObjectProvider<Propagator> propagator) {
        this.repository = repository;
        this.codec = codec;
        this.tracer = tracer;
        this.propagator = propagator;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void append(String topic, String key, EventEnvelope<?> envelope) {
        Map<String, String> carrier = captureTraceContext();
        repository.save(new OutboxEvent(
                envelope.id(),
                topic,
                key,
                envelope.type(),
                codec.serialize(envelope),
                envelope.occurredAt(),
                carrier.get("traceparent"),
                carrier.get("tracestate")));
    }

    /**
     * Injects the active trace context into a carrier map. Returns an empty map when
     * tracing is absent (no-op service) or no span is active.
     */
    private Map<String, String> captureTraceContext() {
        Map<String, String> carrier = new HashMap<>();
        Tracer t = tracer.getIfAvailable();
        Propagator p = propagator.getIfAvailable();
        if (t == null || p == null) {
            return carrier;
        }
        TraceContext context = t.currentTraceContext().context();
        if (context == null) {
            return carrier;
        }
        p.inject(context, carrier, Map::put);
        return carrier;
    }
}
