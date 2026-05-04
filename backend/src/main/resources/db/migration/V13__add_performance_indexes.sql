CREATE INDEX idx_reviews_experience_parent_created_at
    ON reviews(experience_id, parent_id, created_at);

CREATE INDEX idx_experience_categories_category_experience
    ON experience_categories(category_id, experience_id);
