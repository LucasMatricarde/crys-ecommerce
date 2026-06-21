package com.crys.catalog.web;

import com.crys.catalog.domain.Product;
import com.crys.catalog.domain.StrainType;

import java.util.Locale;

/**
 * REST view of a {@link Product}. Adds {@code priceFormatted} (BRL, comma
 * decimal) so the storefront can render "R$ 189,90" without client-side money
 * logic, while keeping {@code priceCents} for any client that wants the raw int.
 */
public record ProductResponse(
        String id,
        String slug,
        String name,
        StrainType strainType,
        double thcPercent,
        double cbdPercent,
        double weightGrams,
        int priceCents,
        String priceFormatted,
        String imageSlot,
        boolean available,
        String description
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.id(),
                p.slug(),
                p.name(),
                p.strainType(),
                p.thcPercent(),
                p.cbdPercent(),
                p.weightGrams(),
                p.priceCents(),
                formatBrl(p.priceCents()),
                p.imageSlot(),
                p.available(),
                p.description()
        );
    }

    private static String formatBrl(int cents) {
        return String.format(Locale.of("pt", "BR"), "R$ %,.2f", cents / 100.0);
    }
}
