package com.crys.catalog.config;

import com.crys.catalog.domain.Product;
import com.crys.catalog.domain.ProductRepository;
import com.crys.catalog.domain.StrainType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the example CRYS catalog. Active only under the {@code seed} profile so
 * production runs don't auto-write. Idempotent: skips if products already exist.
 * Prices in BRL cents; THC/CBD reflect craft extracts (high potency, on-brand).
 */
@Component
@Profile("seed")
public class CatalogSeed implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CatalogSeed.class);

    private final ProductRepository repository;

    public CatalogSeed(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            log.info("Catalog already seeded ({} products) — skipping.", repository.count());
            return;
        }

        List<Product> products = List.of(
                new Product(null, "rosin-premium", "Rosin Premium", StrainType.HYBRID,
                        78.0, 1.2, 1.0, 18990, "rosin",
                        true, "Live rosin prensado a frio, sem solventes. Terpenos preservados, textura amanteigada."),
                new Product(null, "ice-hash-6-estrelas", "Ice Hash 6★", StrainType.INDICA,
                        62.0, 0.9, 2.0, 14990, "ice-hash",
                        true, "Hash de água gelada, classificação 6 estrelas. Full-melt, fumaça densa e limpa."),
                new Product(null, "live-resin-amber", "Live Resin Amber", StrainType.SATIVA,
                        81.0, 0.4, 1.0, 21990, "live-resin",
                        true, "Extração de planta fresca congelada. Perfil cítrico vibrante, âmbar translúcido."),
                new Product(null, "bubble-hash-frost", "Bubble Hash Frost", StrainType.HYBRID,
                        55.0, 1.5, 3.5, 9990, "bubble-hash",
                        true, "Tricomas separados a frio. Solto, aromático, curado artesanalmente."),
                new Product(null, "diamantes-cbd", "Diamantes CBD", StrainType.INDICA,
                        12.0, 24.0, 1.0, 16990, "diamonds",
                        true, "Cristais de CBD de alta pureza com terpenos botânicos. Calmo, sem efeito intenso."),
                new Product(null, "shatter-cristal", "Shatter Cristal", StrainType.SATIVA,
                        85.0, 0.3, 1.0, 17990, "shatter",
                        false, "Concentrado vítreo, quebradiço, potência máxima. Edição esgotada.")
        );

        repository.saveAll(products);
        log.info("Seeded {} CRYS products.", products.size());
    }
}
