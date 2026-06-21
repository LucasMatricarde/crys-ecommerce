package com.crys.order.web;

import com.crys.order.domain.Order;
import com.crys.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    /** Accepts the order and returns 202 — the saga resolves it asynchronously. */
    @PostMapping
    public ResponseEntity<OrderResponse> place(@Valid @RequestBody CreateOrderRequest request) {
        Order order = service.place(request.productSlug(), request.quantity());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(OrderResponse.from(order));
    }

    /** Poll for the current status (PENDING until the saga confirms/cancels). */
    @GetMapping("/{id}")
    public OrderResponse status(@PathVariable UUID id) {
        return service.find(id)
                .map(OrderResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }
}
