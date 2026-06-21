package com.crys.catalog.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * A CRYS product (extraction). Stored in the Mongo {@code products} collection.
 * This is the CQRS read model — denormalized, optimized for the storefront.
 *
 * @param priceCents price in BRL cents (e.g. 18990 = R$ 189,90)
 * @param weightGrams net weight in grams (fractional, e.g. 3.5)
 * @param imageSlot   key referencing the green-tinted image slot asset
 */
@Document("products")
public record Product(
        @Id String id,
        @Indexed(unique = true) String slug,
        String name,
        StrainType strainType,
        double thcPercent,
        double cbdPercent,
        double weightGrams,
        int priceCents,
        String imageSlot,
        boolean available,
        String description
) {
}
