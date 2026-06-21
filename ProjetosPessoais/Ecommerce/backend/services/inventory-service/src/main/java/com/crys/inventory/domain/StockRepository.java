package com.crys.inventory.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRepository extends JpaRepository<StockItem, String> {

    Optional<StockItem> findByProductSlug(String productSlug);
}
