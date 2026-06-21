package com.crys.order.web;

import com.crys.events.EventTypes;
import com.crys.order.AbstractSagaIntegrationTest;
import com.crys.order.domain.OrderStatus;
import com.crys.order.pricing.PricingClient;
import com.crys.messaging.outbox.OutboxRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class OrderApiIT extends AbstractSagaIntegrationTest {

    /** Stub the catalog so the test doesn't need catalog-service running. */
    @TestConfiguration
    static class StubPricing {
        @Bean
        @Primary
        PricingClient pricingClient() {
            return slug -> 18990L; // R$ 189,90
        }
    }

    @Autowired
    TestRestTemplate rest;

    @Autowired
    OutboxRepository outbox;

    @Test
    void placeOrderReturns202PendingAndWritesOutbox() {
        ResponseEntity<OrderResponse> created = rest.postForEntity(
                "/orders", new CreateOrderRequest("rosin-premium", 2), OrderResponse.class);

        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
        OrderResponse body = created.getBody();
        assertThat(body).isNotNull();
        assertThat(body.status()).isEqualTo(OrderStatus.PENDING);
        assertThat(body.amountCents()).isEqualTo(37980L); // 18990 * 2

        // OrderCreated landed in the outbox (same tx as the order insert).
        assertThat(outbox.findAll())
                .anyMatch(e -> e.getType().equals(EventTypes.ORDER_CREATED)
                        && e.getKey().equals(body.id().toString()));

        // Status endpoint round-trips.
        ResponseEntity<OrderResponse> fetched = rest.getForEntity(
                "/orders/" + body.id(), OrderResponse.class);
        assertThat(fetched.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(fetched.getBody().status()).isEqualTo(OrderStatus.PENDING);
    }
}
