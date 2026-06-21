-- One logical database per transactional service (single Postgres instance).
-- Runs once on first container start via docker-entrypoint-initdb.d.
CREATE DATABASE crys_order;
CREATE DATABASE crys_inventory;
CREATE DATABASE crys_payment;
