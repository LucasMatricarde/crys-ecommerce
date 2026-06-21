package com.crys.catalog.web;

import com.crys.catalog.AbstractIntegrationTest;
import com.crys.catalog.domain.Product;
import com.crys.catalog.domain.ProductRepository;
import com.crys.catalog.domain.StrainType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductControllerIT extends AbstractIntegrationTest {

    @Autowired
    TestRestTemplate rest;

    @Autowired
    ProductRepository repository;

    @BeforeEach
    void seed() {
        repository.deleteAll();
        repository.save(new Product(null, "rosin-premium", "Rosin Premium", StrainType.HYBRID,
                78.0, 1.2, 1.0, 18990, "rosin", true, "Live rosin"));
        repository.save(new Product(null, "ice-hash", "Ice Hash 6★", StrainType.INDICA,
                62.0, 0.9, 2.0, 14990, "ice-hash", true, "Ice hash"));
    }

    @Test
    void getBySlugReturnsFormattedPrice() {
        ResponseEntity<ProductResponse> response =
                rest.getForEntity("/catalog/products/rosin-premium", ProductResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().name()).isEqualTo("Rosin Premium");
        assertThat(response.getBody().priceFormatted()).isEqualTo("R$ 189,90");
    }

    @Test
    void unknownSlugReturns404() {
        ResponseEntity<String> response =
                rest.getForEntity("/catalog/products/does-not-exist", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void listFiltersByStrainType() {
        ResponseEntity<String> response =
                rest.getForEntity("/catalog/products?strainType=INDICA", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("ice-hash");
        assertThat(response.getBody()).doesNotContain("rosin-premium");
    }
}
