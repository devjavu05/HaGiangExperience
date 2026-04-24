package com.hagiang.localexperience.common.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaMigrationRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        ensureUsersPhoneNumberColumn();

        if (columnExists("experiences", "image_url")) {
            jdbcTemplate.execute("ALTER TABLE experiences DROP COLUMN image_url");
        }

        if (columnExists("experiences", "local_host_id")) {
            if (indexExists("experiences", "idx_experiences_local_host_id")) {
                jdbcTemplate.execute("ALTER TABLE experiences DROP INDEX idx_experiences_local_host_id");
            }
            jdbcTemplate.execute("ALTER TABLE experiences DROP COLUMN local_host_id");
        }

        if (!columnExists("experiences", "user_id")) {
            jdbcTemplate.execute("ALTER TABLE experiences ADD COLUMN user_id BIGINT NULL");
        }

        jdbcTemplate.execute(
                """
                CREATE TABLE IF NOT EXISTS experience_itineraries (
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    experience_id BIGINT NOT NULL,
                    day_number INT NOT NULL DEFAULT 1,
                    time_tag VARCHAR(100) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    CONSTRAINT fk_experience_itineraries_experience
                        FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
                )
                """
        );

        if (!columnExists("experience_itineraries", "day_number")) {
            jdbcTemplate.execute("ALTER TABLE experience_itineraries ADD COLUMN day_number INT NOT NULL DEFAULT 1");
        }

        jdbcTemplate.execute(
                """
                CREATE TABLE IF NOT EXISTS categories (
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(150) NOT NULL UNIQUE,
                    slug VARCHAR(100) NOT NULL UNIQUE,
                    color_code VARCHAR(20) NOT NULL
                )
                """
        );

        jdbcTemplate.execute(
                """
                CREATE TABLE IF NOT EXISTS experience_categories (
                    experience_id BIGINT NOT NULL,
                    category_id BIGINT NOT NULL,
                    PRIMARY KEY (experience_id, category_id),
                    CONSTRAINT fk_experience_categories_experience
                        FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
                    CONSTRAINT fk_experience_categories_category
                        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
                )
                """
        );

        jdbcTemplate.execute(
                """
                CREATE TABLE IF NOT EXISTS reviews (
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
                )
                """
        );

        if (!columnExists("reviews", "parent_id")) {
            jdbcTemplate.execute("ALTER TABLE reviews ADD COLUMN parent_id BIGINT NULL");
            jdbcTemplate.execute(
                    """
                    ALTER TABLE reviews
                    ADD CONSTRAINT fk_reviews_parent
                    FOREIGN KEY (parent_id) REFERENCES reviews(id) ON DELETE CASCADE
                    """
            );
        }
        jdbcTemplate.execute("ALTER TABLE reviews MODIFY COLUMN rating INT NULL");
        if (!columnExists("reviews", "host_reply")) {
            jdbcTemplate.execute("ALTER TABLE reviews ADD COLUMN host_reply TEXT NULL");
        }
        if (!columnExists("reviews", "host_reply_created_at")) {
            jdbcTemplate.execute("ALTER TABLE reviews ADD COLUMN host_reply_created_at TIMESTAMP NULL");
        }

        ensureIndex("experiences", "idx_experiences_created_at", "CREATE INDEX idx_experiences_created_at ON experiences(created_at)");
        ensureIndex("experiences", "idx_experiences_price", "CREATE INDEX idx_experiences_price ON experiences(price)");
        ensureIndex("experiences", "idx_experiences_user_id", "CREATE INDEX idx_experiences_user_id ON experiences(user_id)");
        ensureIndex(
                "experience_categories",
                "idx_experience_categories_category_experience",
                "CREATE INDEX idx_experience_categories_category_experience ON experience_categories(category_id, experience_id)"
        );
        ensureIndex(
                "experience_itineraries",
                "idx_experience_itineraries_experience_day",
                "CREATE INDEX idx_experience_itineraries_experience_day ON experience_itineraries(experience_id, day_number)"
        );
        ensureIndex(
                "reviews",
                "idx_reviews_experience_created_at",
                "CREATE INDEX idx_reviews_experience_created_at ON reviews(experience_id, created_at)"
        );
        ensureIndex(
                "reviews",
                "idx_reviews_parent_id",
                "CREATE INDEX idx_reviews_parent_id ON reviews(parent_id)"
        );

        seedCategory("Văn hóa & Đời sống", "culture", "#E8F3EE");
        seedCategory("Chinh phục & Khám phá", "adventure", "#EBF5FF");
        seedCategory("Nghỉ dưỡng & Chữa lành", "healing", "#F3E8FF");
        seedCategory("Ẩm thực bản địa", "foodie", "#FDF2E9");
        seedCategory("Thủ Công & Truyền Thống", "craft", "#F6F0E7");
        seedCategory("Nghệ thuật & Trang phục", "art-costume", "#FFF1F6");
        seedCategory("Trải nghiệm địa phương", "local-experience", "#F2F8EC");
        seedCategory("Check-in cảnh quan", "landscape-checkin", "#EEF9FC");
        seedCategory("Văn hoá – Lễ hội", "festival-culture", "#FFF7E8");
        seedCategory("Phong tục – Tập quán", "customs", "#F5F1FF");
    }

    private boolean columnExists(String tableName, String columnName) {
        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                  AND table_name = ?
                  AND column_name = ?
                """,
                Integer.class,
                tableName,
                columnName
        );
        return count != null && count > 0;
    }

    private void ensureUsersPhoneNumberColumn() {
        if (!columnExists("users", "phone_number")) {
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NULL");
        }

        jdbcTemplate.update(
                """
                UPDATE users
                SET phone_number = CONCAT('000000', id)
                WHERE phone_number IS NULL OR TRIM(phone_number) = ''
                """
        );

        jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN phone_number VARCHAR(20) NOT NULL");
        ensureIndex(
                "users",
                "uk_users_phone_number",
                "CREATE UNIQUE INDEX uk_users_phone_number ON users(phone_number)"
        );
    }

    private boolean indexExists(String tableName, String indexName) {
        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM information_schema.statistics
                WHERE table_schema = DATABASE()
                  AND table_name = ?
                  AND index_name = ?
                """,
                Integer.class,
                tableName,
                indexName
        );
        return count != null && count > 0;
    }

    private void ensureIndex(String tableName, String indexName, String createSql) {
        if (!indexExists(tableName, indexName)) {
            jdbcTemplate.execute(createSql);
        }
    }

    private void seedCategory(String name, String slug, String colorCode) {
        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM categories
                WHERE slug = ?
                """,
                Integer.class,
                slug
        );

        if (count == null || count == 0) {
            jdbcTemplate.update(
                    "INSERT INTO categories(name, slug, color_code) VALUES (?, ?, ?)",
                    name,
                    slug,
                    colorCode
            );
        }
    }
}
