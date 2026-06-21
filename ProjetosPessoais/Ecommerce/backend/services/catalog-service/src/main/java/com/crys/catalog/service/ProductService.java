package com.crys.catalog.service;

import com.crys.catalog.domain.Product;
import com.crys.catalog.domain.ProductNotFoundException;
import com.crys.catalog.domain.ProductRepository;
import com.crys.catalog.domain.StrainType;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Page<Product> list(StrainType strainType, Pageable pageable) {
        return strainType == null
                ? repository.findAll(pageable)
                : repository.findByStrainType(strainType, pageable);
    }

    /**
     * Fetch by slug, caching in Redis. The product-detail page is the hot path;
     * the second call for a given slug is served from cache, not Mongo.
     */
    @Cacheable(cacheNames = "product", key = "#slug")
    public Product getBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> new ProductNotFoundException(slug));
    }
}
