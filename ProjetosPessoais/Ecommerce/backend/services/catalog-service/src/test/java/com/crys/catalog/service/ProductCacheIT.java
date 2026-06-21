package com.crys.catalog.service;

import com.crys.catalog.AbstractIntegrationTest;
import com.crys.catalog.domain.Product;
import com.crys.catalog.domain.ProductRepository;
import com.crys.catalog.domain.StrainType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

/**
 * Verifies the Redis cache short-circuits Mongo: the second {@code getBySlug}
 * for the same slug must NOT hit the repository.
 */
class ProductCacheIT extends AbstractIntegrationTest {

    @SpyBean
    ProductRepository repository;

    @Autowired
    ProductService service;

    @Autowired
    CacheManager cacheManager;

    @BeforeEach
    void setup() {
        var cache = cacheManager.getCache("product");
        if (cache != null) {
            cache.clear();
        }
        repository.deleteAll();
        repository.save(new Product(null, "rosin-premium", "Rosin Premium", StrainType.HYBRID,
                78.0, 1.2, 1.0, 18990, "rosin", true, "desc"));
    }

    @Test
    void secondLookupServedFromCache() {
        Product first = service.getBySlug("rosin-premium");
        Product second = service.getBySlug("rosin-premium");

        assertThat(first.slug()).isEqualTo("rosin-premium");
        assertThat(second).isEqualTo(first);
        // findBySlug invoked once despite two service calls — second came from Redis.
        verify(repository, times(1)).findBySlug("rosin-premium");
    }
}
