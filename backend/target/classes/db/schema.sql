CREATE DATABASE IF NOT EXISTS hagiang_local_experience;
USE hagiang_local_experience;

CREATE TABLE experiences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL COMMENT 'Example: [THONG NGUYEN] Hai tra cung nguoi ban dia',
    description VARCHAR(500) NOT NULL COMMENT 'Short summary for card/list view',
    content_detail LONGTEXT NOT NULL COMMENT 'Rich text/HTML detail content',
    activities JSON NOT NULL COMMENT 'Array of activities',
    highlights JSON NOT NULL COMMENT 'Array of highlights',
    duration VARCHAR(100) NOT NULL COMMENT 'Example: 1 day, 2 hours',
    price DECIMAL(12, 2) NOT NULL COMMENT 'Price in VND or selected currency',
    address VARCHAR(500) NULL COMMENT 'Specific address shown on the map',
    maps_place_id VARCHAR(255) NULL COMMENT 'Google Maps Place ID for exact map pin',
    latitude DECIMAL(10, 7) NULL COMMENT 'Latitude from Google Places geometry',
    longitude DECIMAL(10, 7) NULL COMMENT 'Longitude from Google Places geometry',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_experiences_created_at (created_at)
);

CREATE TABLE experience_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    experience_id BIGINT NOT NULL COMMENT 'Reference to experiences table',
    image_url VARCHAR(500) NOT NULL COMMENT 'Local file path or public asset path',
    CONSTRAINT fk_experience_images_experience
        FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
    INDEX idx_experience_images_experience_id (experience_id)
);

CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    experience_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NULL,
    comment TEXT NOT NULL,
    parent_id BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_experience
        FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_parent
        FOREIGN KEY (parent_id) REFERENCES reviews(id) ON DELETE CASCADE
);

INSERT INTO experiences (
    title,
    description,
    content_detail,
    activities,
    highlights,
    duration,
    price,
    address,
    maps_place_id,
    latitude,
    longitude
) VALUES (
    '[THONG NGUYEN] Hai tra cung nguoi ban dia',
    'Trai nghiem doi song nong nghiep va van hoa ban dia tai Ha Giang.',
    '<p>Ban se dong hanh cung nguoi dan dia phuong de tim hieu quy trinh trong va hai tra.</p>',
    JSON_ARRAY('Hai tra', 'Di bo tham doi', 'Thuong thuc tra'),
    JSON_ARRAY('Ket noi van hoa dia phuong', 'Canh quan nui rung dep', 'Phu hop nhom nho'),
    '1 ngay',
    450000.00,
    'Thon Phin Ho, Thong Nguyen, Hoang Su Phi, Ha Giang',
    'sample_google_place_id_ha_giang',
    22.7642100,
    104.6724500
);

INSERT INTO experience_images (experience_id, image_url) VALUES
    (1, '/uploads/experiences/thong-nguyen-hai-tra-1.jpg'),
    (1, '/uploads/experiences/thong-nguyen-hai-tra-2.jpg');
