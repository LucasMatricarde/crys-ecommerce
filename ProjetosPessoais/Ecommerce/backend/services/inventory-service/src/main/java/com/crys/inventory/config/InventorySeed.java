package com.crys.inventory.config;

import com.crys.inventory.domain.StockItem;
import com.crys.inventory.domain.StockRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds stock for the Inc 1 catalog slugs (active only under the {@code seed}
 * profile, idempotent). {@code shatter-cristal} is seeded at 0 to mirror the
 * storefront's sold-out item — handy for exercising the inventory-reject path.
 */
@Component
@Profile("seed")
public class InventorySeed implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(InventorySeed.class);

    private final StockRepository repository;

    public InventorySeed(StockRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            log.info("Stock already seeded — skipping.");
            return;
        }
        repository.saveAll(List.of(
                new StockItem("rosin-premium", 100),
                new StockItem("ice-hash-6-estrelas", 100),
                new StockItem("live-resin-amber", 100),
                new StockItem("bubble-hash-frost", 100),
                new StockItem("diamantes-cbd", 100),
                new StockItem("shatter-cristal", 0)
        ));
        log.info("Seeded stock for 6 products.");
    }
}
