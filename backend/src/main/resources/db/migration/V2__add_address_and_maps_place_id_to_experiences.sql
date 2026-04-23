ALTER TABLE experiences
    ADD COLUMN address VARCHAR(500) NULL AFTER price,
    ADD COLUMN maps_place_id VARCHAR(255) NULL AFTER address;
