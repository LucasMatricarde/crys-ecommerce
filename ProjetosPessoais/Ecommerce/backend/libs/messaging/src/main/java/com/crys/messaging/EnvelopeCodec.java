package com.crys.messaging;

import com.crys.events.EventEnvelope;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Serializes an {@link EventEnvelope} to JSON for the wire/outbox, and parses an
 * inbound JSON string back into its discriminator + raw payload node. The payload
 * is kept as a {@link JsonNode} so the consumer can convert it to the concrete
 * record type it expects via {@link #payload(Incoming, Class)}.
 */
@Component
public class EnvelopeCodec {

    private final ObjectMapper mapper;

    public EnvelopeCodec(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public String serialize(EventEnvelope<?> envelope) {
        try {
            return mapper.writeValueAsString(envelope);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialize envelope " + envelope.type(), e);
        }
    }

    public Incoming parse(String json) {
        try {
            JsonNode node = mapper.readTree(json);
            return new Incoming(
                    UUID.fromString(node.get("id").asText()),
                    node.get("type").asText(),
                    node.get("payload"));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse envelope JSON", e);
        }
    }

    public <T> T payload(Incoming incoming, Class<T> type) {
        return mapper.convertValue(incoming.payload(), type);
    }

    /** Parsed envelope: id (for idempotency), type (for routing), raw payload node. */
    public record Incoming(UUID id, String type, JsonNode payload) {
    }
}
