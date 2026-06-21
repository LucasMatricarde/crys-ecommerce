package com.crys.orderquery.messaging;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Parses an inbound envelope JSON string into its id (idempotency), type (routing),
 * and raw payload node. Mirrors libs:messaging's codec, kept local so this Mongo-only
 * service avoids the JPA-backed messaging library.
 */
@Component
public class EnvelopeCodec {

    private final ObjectMapper mapper;

    public EnvelopeCodec(ObjectMapper mapper) {
        this.mapper = mapper;
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

    public record Incoming(UUID id, String type, JsonNode payload) {
    }
}
