package com.crys.order.pricing;

/** Resolves the unit price (BRL cents) of a product by slug. */
public interface PricingClient {

    long priceCents(String slug);
}
