package com.crys.notification.web;

import com.crys.notification.domain.Notification;
import com.crys.notification.domain.NotificationType;

import java.time.Instant;

/** REST view of a {@link Notification}. */
public record NotificationResponse(
        String id,
        String orderId,
        NotificationType type,
        String channel,
        String message,
        Instant createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.id(), n.orderId(), n.type(), n.channel(), n.message(), n.createdAt());
    }
}
