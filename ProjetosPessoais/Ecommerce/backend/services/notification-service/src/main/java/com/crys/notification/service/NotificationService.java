package com.crys.notification.service;

import com.crys.notification.domain.Notification;
import com.crys.notification.domain.NotificationRepository;
import com.crys.notification.domain.NotificationType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Builds the on-brand pt-BR copy for each order event, persists the notification,
 * and "sends" it (mock — logged at INFO). Voice follows the CRYS. brand: artisanal,
 * declarative, no emoji.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notifications;

    public NotificationService(NotificationRepository notifications) {
        this.notifications = notifications;
    }

    public void orderReceived(String orderId) {
        send(orderId, NotificationType.ORDER_RECEIVED,
                "Recebemos seu pedido. Estamos preparando sua resina com cuidado artesanal.");
    }

    public void orderConfirmed(String orderId) {
        send(orderId, NotificationType.ORDER_CONFIRMED,
                "Pedido confirmado! Sua resina está a caminho.");
    }

    public void orderCancelled(String orderId, String reason) {
        send(orderId, NotificationType.ORDER_CANCELLED,
                "Seu pedido foi cancelado: " + reason + ".");
    }

    private void send(String orderId, NotificationType type, String message) {
        Notification saved = notifications.save(Notification.mock(orderId, type, message));
        log.info("[mock-send] {} para pedido {}: {}", type, orderId, saved.message());
    }
}
