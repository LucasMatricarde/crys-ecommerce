package com.crys.messaging.config;

import com.crys.events.Topics;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaAdmin;

/**
 * Declares every saga topic and its dead-letter topic so KafkaAdmin creates them
 * on startup (single broker → 1 partition, replication 1). Declaring all of them
 * in each service is harmless — topic creation is idempotent — and means the DLTs
 * exist before the error handler ever needs them.
 */
@Configuration
public class TopicsConfig {

    private static final String[] TOPICS = {
            Topics.ORDER_EVENTS,
            Topics.INVENTORY_COMMANDS,
            Topics.INVENTORY_EVENTS,
            Topics.PAYMENT_COMMANDS,
            Topics.PAYMENT_EVENTS,
    };

    @Bean
    public KafkaAdmin.NewTopics sagaTopics() {
        NewTopic[] all = new NewTopic[TOPICS.length * 2];
        int i = 0;
        for (String topic : TOPICS) {
            all[i++] = TopicBuilder.name(topic).partitions(1).replicas(1).build();
            all[i++] = TopicBuilder.name(Topics.dlt(topic)).partitions(1).replicas(1).build();
        }
        return new KafkaAdmin.NewTopics(all);
    }
}
