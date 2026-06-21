package com.crys.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Scans this service plus the shared {@code com.crys.messaging} library so the
 * outbox/idempotency entities, repositories, and Kafka config are picked up here.
 */
@SpringBootApplication(scanBasePackages = {"com.crys.order", "com.crys.messaging"})
@EntityScan({"com.crys.order", "com.crys.messaging"})
@EnableJpaRepositories({"com.crys.order", "com.crys.messaging"})
@EnableScheduling
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
