package com.crys.events;

/**
 * Canonical {@link EventEnvelope#type()} discriminator values. Consumers switch on
 * these to route an envelope to the right handler, so producer and consumer must
 * agree on the exact strings — keep them here, never inline.
 */
public final class EventTypes {

    private EventTypes() {
    }

    public static final String ORDER_CREATED = "OrderCreated";
    public static final String ORDER_CONFIRMED = "OrderConfirmed";
    public static final String ORDER_CANCELLED = "OrderCancelled";

    public static final String RESERVE_INVENTORY = "ReserveInventory";
    public static final String RELEASE_INVENTORY = "ReleaseInventory";
    public static final String INVENTORY_RESERVED = "InventoryReserved";
    public static final String INVENTORY_REJECTED = "InventoryRejected";

    public static final String PROCESS_PAYMENT = "ProcessPayment";
    public static final String PAYMENT_APPROVED = "PaymentApproved";
    public static final String PAYMENT_DECLINED = "PaymentDeclined";
}
