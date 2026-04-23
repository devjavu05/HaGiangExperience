ALTER TABLE experiences
    ADD COLUMN latitude DECIMAL(10, 7) NULL AFTER maps_place_id,
    ADD COLUMN longitude DECIMAL(10, 7) NULL AFTER latitude;
