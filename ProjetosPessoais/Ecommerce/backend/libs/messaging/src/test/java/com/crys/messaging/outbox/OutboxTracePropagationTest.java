package com.crys.messaging.outbox;

import com.crys.events.EventEnvelope;
import com.crys.messaging.EnvelopeCodec;
import io.micrometer.tracing.Span;
import io.micrometer.tracing.TraceContext;
import io.micrometer.tracing.Tracer;
import io.micrometer.tracing.propagation.Propagator;
import io.micrometer.tracing.test.simple.SimpleTracer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.Header;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.kafka.core.KafkaTemplate;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Verifies the trace context survives the outbox -> Kafka hop: captured on write,
 * re-injected as a record header on relay, and a clean no-op when no span is active.
 */
class OutboxTracePropagationTest {

    private final EnvelopeCodec codec = mock(EnvelopeCodec.class);
    private final OutboxRepository repository = mock(OutboxRepository.class);

    /** Minimal W3C-style propagator: writes the active context's traceId as traceparent. */
    private final Propagator traceparentPropagator = new Propagator() {
        @Override
        public List<String> fields() {
            return List.of("traceparent");
        }

        @Override
        public <C> void inject(TraceContext context, C carrier, Setter<C> setter) {
            setter.set(carrier, "traceparent", context.traceId());
        }

        @Override
        public <C> Span.Builder extract(C carrier, Getter<C> getter) {
            throw new UnsupportedOperationException("not needed for this test");
        }
    };

    @Test
    void append_persists_traceparent_matching_the_active_context() {
        when(codec.serialize(any())).thenReturn("{}");
        SimpleTracer tracer = new SimpleTracer();
        OutboxWriter writer = new OutboxWriter(repository, codec,
                providerOf(tracer), providerOf(traceparentPropagator));

        Span span = tracer.nextSpan().name("order").start();
        String expectedTraceId;
        try (Tracer.SpanInScope scope = tracer.withSpan(span)) {
            expectedTraceId = tracer.currentTraceContext().context().traceId();
            writer.append("orders", "key-1", EventEnvelope.of("OrderPlaced", "data"));
        } finally {
            span.end();
        }

        OutboxEvent saved = captureSaved();
        assertThat(saved.getTraceparent()).isNotNull().isEqualTo(expectedTraceId);
    }

    @Test
    void flush_adds_traceparent_header_equal_to_stored_value() throws Exception {
        OutboxEvent event = new OutboxEvent(java.util.UUID.randomUUID(), "orders", "key-1",
                "OrderPlaced", "{}", java.time.Instant.now(), "00-abc-def-01", "vendor=x");
        when(repository.findTop100ByPublishedAtIsNullOrderByOccurredAtAsc()).thenReturn(List.of(event));

        ProducerRecord<String, String> record = captureSentRecord();

        assertThat(header(record, "traceparent")).isEqualTo("00-abc-def-01");
        assertThat(header(record, "tracestate")).isEqualTo("vendor=x");
    }

    @Test
    void no_active_span_stores_null_and_sends_no_trace_header() throws Exception {
        // Write side: no span in scope -> null traceparent persisted.
        when(codec.serialize(any())).thenReturn("{}");
        SimpleTracer tracer = new SimpleTracer();
        OutboxWriter writer = new OutboxWriter(repository, codec,
                providerOf(tracer), providerOf(traceparentPropagator));

        writer.append("orders", "key-1", EventEnvelope.of("OrderPlaced", "data"));
        assertThat(captureSaved().getTraceparent()).isNull();

        // Relay side: null traceparent -> no trace header on the record.
        OutboxEvent event = new OutboxEvent(java.util.UUID.randomUUID(), "orders", "key-1",
                "OrderPlaced", "{}", java.time.Instant.now());
        when(repository.findTop100ByPublishedAtIsNullOrderByOccurredAtAsc()).thenReturn(List.of(event));

        ProducerRecord<String, String> record = captureSentRecord();
        assertThat(record.headers().lastHeader("traceparent")).isNull();
    }

    private OutboxEvent captureSaved() {
        ArgumentCaptor<OutboxEvent> captor = ArgumentCaptor.forClass(OutboxEvent.class);
        org.mockito.Mockito.verify(repository).save(captor.capture());
        return captor.getValue();
    }

    @SuppressWarnings("unchecked")
    private ProducerRecord<String, String> captureSentRecord() throws Exception {
        KafkaTemplate<String, String> kafka = mock(KafkaTemplate.class);
        when(kafka.send(any(ProducerRecord.class)))
                .thenReturn(CompletableFuture.completedFuture(null));
        new OutboxRelay(repository, kafka).flush();

        ArgumentCaptor<ProducerRecord<String, String>> captor =
                ArgumentCaptor.forClass(ProducerRecord.class);
        org.mockito.Mockito.verify(kafka).send(captor.capture());
        return captor.getValue();
    }

    private static String header(ProducerRecord<String, String> record, String key) {
        Header h = record.headers().lastHeader(key);
        return h == null ? null : new String(h.value(), StandardCharsets.UTF_8);
    }

    @SuppressWarnings("unchecked")
    private static <T> ObjectProvider<T> providerOf(T instance) {
        ObjectProvider<T> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(instance);
        return provider;
    }
}
