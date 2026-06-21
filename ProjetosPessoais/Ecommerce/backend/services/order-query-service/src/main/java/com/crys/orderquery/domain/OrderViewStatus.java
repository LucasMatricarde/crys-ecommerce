package com.crys.orderquery.domain;

/** Lifecycle of an order as seen by the read model. */
public enum OrderViewStatus {
    PENDING,
    RESERVED,
    CONFIRMED,
    CANCELLED
}
