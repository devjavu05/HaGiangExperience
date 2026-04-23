CREATE TABLE experiences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL,
    content_detail LONGTEXT NOT NULL,
    activities JSON NOT NULL,
    highlights JSON NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_experiences_created_at (created_at)
);

CREATE TABLE experience_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    experience_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    CONSTRAINT fk_experience_images_experience
        FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
    INDEX idx_experience_images_experience_id (experience_id)
);
