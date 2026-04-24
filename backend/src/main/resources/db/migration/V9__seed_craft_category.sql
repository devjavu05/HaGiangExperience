INSERT INTO categories(name, slug, color_code)
SELECT 'Thủ Công & Truyền Thống', 'craft', '#F6F0E7'
WHERE NOT EXISTS (
    SELECT 1
    FROM categories
    WHERE slug = 'craft'
);
