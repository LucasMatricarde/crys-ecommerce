package com.crys.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Reacts to order-lifecycle events and persists customer notifications (mock
 * delivery — Mongo + log). Pure consumer; no commands, no JPA, no outbox.
 */
@SpringBootApplication
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}
