package com.crys.notification.web;

import com.crys.notification.domain.NotificationRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<NotificationResponse> byOrder(@RequestParam String orderId) {
        return repository.findByOrderIdOrderByCreatedAtAsc(orderId).stream()
                .map(NotificationResponse::from)
                .toList();
    }
}
