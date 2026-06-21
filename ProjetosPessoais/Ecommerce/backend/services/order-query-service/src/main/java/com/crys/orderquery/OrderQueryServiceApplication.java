package com.crys.orderquery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CQRS read side: consumes order/inventory/payment events and maintains a Mongo
 * {@code order_view} read model. Pure consumer — no commands, no JPA, no outbox.
 */
@SpringBootApplication
public class OrderQueryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderQueryServiceApplication.class, args);
    }
}
