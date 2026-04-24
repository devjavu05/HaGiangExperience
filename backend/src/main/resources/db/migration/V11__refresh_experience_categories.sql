INSERT INTO categories(name, slug, color_code)
SELECT 'Nghệ thuật & Trang phục', 'art-costume', '#FFF1F6'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE slug = 'art-costume'
);

INSERT INTO categories(name, slug, color_code)
SELECT 'Trải nghiệm địa phương', 'local-experience', '#F2F8EC'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE slug = 'local-experience'
);

INSERT INTO categories(name, slug, color_code)
SELECT 'Check-in cảnh quan', 'landscape-checkin', '#EEF9FC'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE slug = 'landscape-checkin'
);

INSERT INTO categories(name, slug, color_code)
SELECT 'Văn hoá – Lễ hội', 'festival-culture', '#FFF7E8'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE slug = 'festival-culture'
);

INSERT INTO categories(name, slug, color_code)
SELECT 'Phong tục – Tập quán', 'customs', '#F5F1FF'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE slug = 'customs'
);

INSERT IGNORE INTO experience_categories (experience_id, category_id)
SELECT ec.experience_id, c_new.id
FROM experience_categories ec
JOIN categories c_old ON c_old.id = ec.category_id
JOIN categories c_new ON c_new.slug = 'local-experience'
WHERE c_old.slug IN ('community', 'agriculture');

INSERT IGNORE INTO experience_categories (experience_id, category_id)
SELECT ec.experience_id, c_new.id
FROM experience_categories ec
JOIN categories c_old ON c_old.id = ec.category_id
JOIN categories c_new ON c_new.slug = 'landscape-checkin'
WHERE c_old.slug = 'nature';

DELETE ec
FROM experience_categories ec
JOIN categories c ON c.id = ec.category_id
WHERE c.slug IN ('community', 'agriculture', 'nature');

DELETE FROM categories
WHERE slug IN ('community', 'agriculture', 'nature');
