package com.crys.notification.domain;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByOrderIdOrderByCreatedAtAsc(String orderId);
}
