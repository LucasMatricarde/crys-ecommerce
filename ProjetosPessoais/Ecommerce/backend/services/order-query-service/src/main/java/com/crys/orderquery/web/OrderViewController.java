package com.crys.orderquery.web;

import com.crys.orderquery.domain.OrderView;
import com.crys.orderquery.domain.OrderViewRepository;
import com.crys.orderquery.domain.OrderViewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/order-views")
public class OrderViewController {

    private final OrderViewRepository repository;

    public OrderViewController(OrderViewRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Page<OrderViewResponse> list(
            @RequestParam(required = false) OrderViewStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<OrderView> result = status == null
                ? repository.findAll(pageable)
                : repository.findByStatus(status, pageable);
        return result.map(OrderViewResponse::from);
    }

    @GetMapping("/{orderId}")
    public OrderViewResponse get(@PathVariable String orderId) {
        return repository.findById(orderId)
                .map(OrderViewResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }
}
