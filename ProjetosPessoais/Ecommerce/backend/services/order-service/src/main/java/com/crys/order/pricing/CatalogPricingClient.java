package com.crys.order.pricing;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

/**
 * Fetches the authoritative price from catalog-service so the order amount is
 * computed server-side (clients can't dictate price). An unknown slug surfaces as
 * 404 to the caller rather than a 500.
 */
@Component
public class CatalogPricingClient implements PricingClient {

    private final RestClient client;

    public CatalogPricingClient(@Value("${crys.catalog.uri:http://localhost:8081}") String catalogUri) {
        this.client = RestClient.create(catalogUri);
    }

    @Override
    public long priceCents(String slug) {
        PriceView view = client.get()
                .uri("/catalog/products/{slug}", slug)
                .retrieve()
                .onStatus(status -> status.value() == HttpStatus.NOT_FOUND.value(),
                        (req, res) -> {
                            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado: " + slug);
                        })
                .body(PriceView.class);
        if (view == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado: " + slug);
        }
        return view.priceCents();
    }

    private record PriceView(long priceCents) {
    }
}
