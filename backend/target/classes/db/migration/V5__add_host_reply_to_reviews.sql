ALTER TABLE reviews
    ADD COLUMN host_reply TEXT NULL,
    ADD COLUMN host_reply_created_at TIMESTAMP NULL;
