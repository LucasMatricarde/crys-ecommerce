package com.crys.catalog.domain;

import com.crys.catalog.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class ProductRepositoryIT extends AbstractIntegrationTest {

    @Autowired
    ProductRepository repository;

    @BeforeEach
    void clean() {
        repository.deleteAll();
        repository.save(new Product(null, "rosin-premium", "Rosin Premium", StrainType.HYBRID,
                78.0, 1.2, 1.0, 18990, "rosin", true, "desc"));
        repository.save(new Product(null, "ice-hash", "Ice Hash 6★", StrainType.INDICA,
                62.0, 0.9, 2.0, 14990, "ice-hash", true, "desc"));
    }

    @Test
    void findsBySlug() {
        Optional<Product> found = repository.findBySlug("rosin-premium");
        assertThat(found).isPresent();
        assertThat(found.get().name()).isEqualTo("Rosin Premium");
    }

    @Test
    void filtersByStrainType() {
        Page<Product> page = repository.findByStrainType(StrainType.INDICA, PageRequest.of(0, 10));
        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().get(0).slug()).isEqualTo("ice-hash");
    }
}
