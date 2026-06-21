package com.crys.orderquery.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderViewRepository extends MongoRepository<OrderView, String> {

    Page<OrderView> findByStatus(OrderViewStatus status, Pageable pageable);
}
