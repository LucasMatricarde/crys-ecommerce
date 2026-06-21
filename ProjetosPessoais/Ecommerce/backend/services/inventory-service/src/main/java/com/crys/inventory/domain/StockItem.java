package com.crys.inventory.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Stock for one product, keyed by slug. {@code available} is what can still be
 * sold; {@code reserved} is held against in-flight orders. Reserving moves units
 * available→reserved; releasing (compensation) moves them back.
 */
@Entity
@Table(name = "stock_item")
public class StockItem {

    @Id
    private String productSlug;

    private int available;

    private int reserved;

    protected StockItem() {
    }

    public StockItem(String productSlug, int available) {
        this.productSlug = productSlug;
        this.available = available;
        this.reserved = 0;
    }

    public String getProductSlug() {
        return productSlug;
    }

    public int getAvailable() {
        return available;
    }

    public int getReserved() {
        return reserved;
    }

    public boolean canReserve(int quantity) {
        return available >= quantity;
    }

    public void reserve(int quantity) {
        this.available -= quantity;
        this.reserved += quantity;
    }

    public void release(int quantity) {
        this.reserved = Math.max(0, this.reserved - quantity);
        this.available += quantity;
    }
}
