package com.crys.orderquery.service;

import com.crys.events.InventoryRejected;
import com.crys.events.InventoryReserved;
import com.crys.events.OrderCancelled;
import com.crys.events.OrderConfirmed;
import com.crys.events.OrderCreated;
import com.crys.events.PaymentApproved;
import com.crys.events.PaymentDeclined;
import com.crys.orderquery.domain.OrderView;
import com.crys.orderquery.domain.OrderViewRepository;
import com.crys.orderquery.domain.OrderViewStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Applies each domain event to the {@code order_view} read model. Every handler is
 * an upsert (get-or-create) plus a timeline append, so an event that arrives before
 * its predecessor was projected still lands without dropping data. Terminal status
 * is set idempotently.
 */
@Service
public class OrderViewProjector {

    private final OrderViewRepository views;

    public OrderViewProjector(OrderViewRepository views) {
        this.views = views;
    }

    public void onOrderCreated(OrderCreated e) {
        OrderView view = getOrCreate(e.orderId())
                .details(e.productSlug(), e.quantity(), e.amountCents())
                .status(OrderViewStatus.PENDING)
                .addStep("created");
        views.save(view);
    }

    public void onInventoryReserved(InventoryReserved e) {
        OrderView view = getOrCreate(e.orderId())
                .status(OrderViewStatus.RESERVED)
                .addStep("reserved");
        views.save(view);
    }

    public void onInventoryRejected(InventoryRejected e) {
        OrderView view = getOrCreate(e.orderId())
                .reason(e.reason())
                .addStep("inventory-rejected");
        views.save(view);
    }

    public void onPaymentApproved(PaymentApproved e) {
        OrderView view = getOrCreate(e.orderId()).addStep("payment-approved");
        views.save(view);
    }

    public void onPaymentDeclined(PaymentDeclined e) {
        OrderView view = getOrCreate(e.orderId())
                .reason(e.reason())
                .addStep("payment-declined");
        views.save(view);
    }

    public void onOrderConfirmed(OrderConfirmed e) {
        OrderView view = getOrCreate(e.orderId())
                .status(OrderViewStatus.CONFIRMED)
                .addStep("confirmed");
        views.save(view);
    }

    public void onOrderCancelled(OrderCancelled e) {
        OrderView view = getOrCreate(e.orderId())
                .status(OrderViewStatus.CANCELLED)
                .reason(e.reason())
                .addStep("cancelled");
        views.save(view);
    }

    private OrderView getOrCreate(UUID orderId) {
        String id = orderId.toString();
        return views.findById(id).orElseGet(() -> new OrderView(id));
    }
}
