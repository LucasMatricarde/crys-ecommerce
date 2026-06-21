package com.crys.order.service;

import com.crys.events.EventEnvelope;
import com.crys.events.EventTypes;
import com.crys.events.OrderCreated;
import com.crys.events.Topics;
import com.crys.order.domain.Order;
import com.crys.order.domain.OrderRepository;
import com.crys.order.pricing.PricingClient;
import com.crys.messaging.outbox.OutboxWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final OutboxWriter outbox;
    private final PricingClient pricing;

    public OrderService(OrderRepository repository, OutboxWriter outbox, PricingClient pricing) {
        this.repository = repository;
        this.outbox = outbox;
        this.pricing = pricing;
    }

    /**
     * Prices the order from the catalog, persists it PENDING, and writes the
     * OrderCreated event to the outbox — all in one transaction, so the order and
     * its kickoff event are durable together. The saga takes it from there.
     */
    @Transactional
    public Order place(String productSlug, int quantity) {
        long amountCents = pricing.priceCents(productSlug) * quantity;
        Order order = repository.save(new Order(productSlug, quantity, amountCents));

        EventEnvelope<OrderCreated> event = EventEnvelope.of(
                EventTypes.ORDER_CREATED,
                new OrderCreated(order.getId(), productSlug, quantity, amountCents));
        outbox.append(Topics.ORDER_EVENTS, order.getId().toString(), event);

        return order;
    }

    @Transactional(readOnly = true)
    public Optional<Order> find(UUID id) {
        return repository.findById(id);
    }
}
