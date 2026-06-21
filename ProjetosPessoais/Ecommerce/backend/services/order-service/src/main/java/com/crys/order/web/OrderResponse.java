package com.crys.order.web;

import com.crys.order.domain.Order;
import com.crys.order.domain.OrderStatus;

import java.util.UUID;

public record OrderResponse(
        UUID id,
        String productSlug,
        int quantity,
        long amountCents,
        OrderStatus status
) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getProductSlug(),
                order.getQuantity(),
                order.getAmountCents(),
                order.getStatus());
    }
}
