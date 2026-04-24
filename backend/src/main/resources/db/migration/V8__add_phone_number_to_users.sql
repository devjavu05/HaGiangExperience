ALTER TABLE users
    ADD COLUMN phone_number VARCHAR(20) NULL;

UPDATE users
SET phone_number = CONCAT('000000', id)
WHERE phone_number IS NULL OR TRIM(phone_number) = '';

ALTER TABLE users
    MODIFY COLUMN phone_number VARCHAR(20) NOT NULL;

CREATE UNIQUE INDEX uk_users_phone_number ON users(phone_number);
