ALTER TABLE reviews
    ADD COLUMN parent_id BIGINT NULL,
    ADD CONSTRAINT fk_reviews_parent
        FOREIGN KEY (parent_id) REFERENCES reviews(id) ON DELETE CASCADE;

ALTER TABLE reviews
    DROP INDEX uk_reviews_experience_user;

CREATE INDEX idx_reviews_parent_id ON reviews(parent_id);
