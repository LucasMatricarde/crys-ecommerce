package com.crys.orderquery.idempotency;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProcessedMessageRepository extends MongoRepository<ProcessedMessage, String> {
}
