ALTER TABLE experiences
    ADD COLUMN nearby_stays JSON NULL
    AFTER highlights;

UPDATE experiences
SET nearby_stays = JSON_ARRAY();

ALTER TABLE experiences
    MODIFY COLUMN nearby_stays JSON NOT NULL;
