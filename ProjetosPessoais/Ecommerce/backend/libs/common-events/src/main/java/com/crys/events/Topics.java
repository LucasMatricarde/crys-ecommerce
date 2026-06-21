package com.crys.events;

/**
 * Kafka topic names. Always reference these constants — never raw strings —
 * so producers and consumers cannot drift.
 *
 * <p>Naming: {@code *.events} carries facts (something happened), {@code *.commands}
 * carries imperatives issued by the order-service saga orchestrator. Each topic has
 * a derived dead-letter topic via {@link #dlt(String)} (Spring Kafka's default
 * {@code .DLT} suffix) for poison messages.
 */
public final class Topics {

    private Topics() {
    }

    /** Facts emitted by order-service (e.g. OrderCreated). */
    public static final String ORDER_EVENTS = "order.events";

    /** Commands the orchestrator sends to inventory-service. */
    public static final String INVENTORY_COMMANDS = "inventory.commands";
    /** Facts emitted by inventory-service (reserved / rejected). */
    public static final String INVENTORY_EVENTS = "inventory.events";

    /** Commands the orchestrator sends to payment-service. */
    public static final String PAYMENT_COMMANDS = "payment.commands";
    /** Facts emitted by payment-service (approved / declined). */
    public static final String PAYMENT_EVENTS = "payment.events";

    public static final String NOTIFICATION_EVENTS = "notification.events";

    /** Dead-letter topic name for a given topic (matches Spring Kafka default suffix). */
    public static String dlt(String topic) {
        return topic + ".DLT";
    }
}
