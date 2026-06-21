package com.crys.payment.saga;

import com.crys.events.EventEnvelope;
import com.crys.events.EventTypes;
import com.crys.events.PaymentApproved;
import com.crys.events.PaymentDeclined;
import com.crys.events.ProcessPayment;
import com.crys.events.Topics;
import com.crys.payment.domain.Payment;
import com.crys.payment.domain.PaymentRepository;
import com.crys.payment.domain.PaymentStatus;
import com.crys.messaging.EnvelopeCodec;
import com.crys.messaging.idempotency.IdempotencyGuard;
import com.crys.messaging.outbox.OutboxWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Mock payment gateway. Approves a charge unless the amount is at/above a
 * configurable decline threshold (so a large-enough order deterministically
 * exercises the compensation path). Persists the payment and emits the result via
 * the outbox, atomically with the idempotency marker.
 */
@Component
public class PaymentListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentListener.class);

    private final PaymentRepository payments;
    private final OutboxWriter outbox;
    private final IdempotencyGuard idempotency;
    private final EnvelopeCodec codec;
    private final long declineThresholdCents;

    public PaymentListener(PaymentRepository payments, OutboxWriter outbox,
                           IdempotencyGuard idempotency, EnvelopeCodec codec,
                           @Value("${crys.payment.decline-threshold-cents:1000000}") long declineThresholdCents) {
        this.payments = payments;
        this.outbox = outbox;
        this.idempotency = idempotency;
        this.codec = codec;
        this.declineThresholdCents = declineThresholdCents;
    }

    @KafkaListener(topics = Topics.PAYMENT_COMMANDS, groupId = "payment-service")
    @Transactional
    public void onCommand(String message) {
        EnvelopeCodec.Incoming in = codec.parse(message);
        if (!idempotency.firstSeen(in.id())) {
            return;
        }
        if (!EventTypes.PROCESS_PAYMENT.equals(in.type())) {
            return;
        }
        ProcessPayment cmd = codec.payload(in, ProcessPayment.class);

        boolean approved = cmd.amountCents() < declineThresholdCents;
        payments.save(new Payment(cmd.orderId(), cmd.amountCents(),
                approved ? PaymentStatus.APPROVED : PaymentStatus.DECLINED));

        if (approved) {
            outbox.append(Topics.PAYMENT_EVENTS, cmd.orderId().toString(),
                    EventEnvelope.of(EventTypes.PAYMENT_APPROVED,
                            new PaymentApproved(cmd.orderId(), cmd.amountCents())));
            log.info("Payment approved for order {} ({} cents)", cmd.orderId(), cmd.amountCents());
        } else {
            outbox.append(Topics.PAYMENT_EVENTS, cmd.orderId().toString(),
                    EventEnvelope.of(EventTypes.PAYMENT_DECLINED,
                            new PaymentDeclined(cmd.orderId(), cmd.amountCents(), "limite excedido")));
            log.info("Payment declined for order {} ({} cents >= {})",
                    cmd.orderId(), cmd.amountCents(), declineThresholdCents);
        }
    }
}
