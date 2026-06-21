package com.crys.notification.idempotency;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProcessedMessageRepository extends MongoRepository<ProcessedMessage, String> {
}
