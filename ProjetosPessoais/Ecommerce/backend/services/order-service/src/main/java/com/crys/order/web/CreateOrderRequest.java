package com.crys.order.web;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateOrderRequest(
        @NotBlank String productSlug,
        @Min(1) int quantity
) {
}
