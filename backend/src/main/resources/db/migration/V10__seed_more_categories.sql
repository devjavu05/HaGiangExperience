INSERT INTO categories(name, slug, color_code)
SELECT 'Nông nghiệp', 'agriculture', '#F1F7E3'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE slug = 'agriculture'
);

INSERT INTO categories(name, slug, color_code)
SELECT 'Thiên nhiên', 'nature', '#EAF7F4'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE slug = 'nature'
);

INSERT INTO categories(name, slug, color_code)
SELECT 'Du lịch cộng đồng', 'community', '#F7F0EA'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE slug = 'community'
);
