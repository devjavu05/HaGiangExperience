package com.hagiang.localexperience.experience.dto;

import java.time.LocalDateTime;

public class ReviewResponseDTO {

    private Long id;
    private Long userId;
    private String username;
    private String avatarUrl;
    private Integer rating;
    private String comment;
    private ReviewReplyResponseDTO reply;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public ReviewReplyResponseDTO getReply() {
        return reply;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final ReviewResponseDTO response = new ReviewResponseDTO();

        public Builder id(Long id) {
            response.id = id;
            return this;
        }

        public Builder userId(Long userId) {
            response.userId = userId;
            return this;
        }

        public Builder username(String username) {
            response.username = username;
            return this;
        }

        public Builder avatarUrl(String avatarUrl) {
            response.avatarUrl = avatarUrl;
            return this;
        }

        public Builder rating(Integer rating) {
            response.rating = rating;
            return this;
        }

        public Builder comment(String comment) {
            response.comment = comment;
            return this;
        }

        public Builder reply(ReviewReplyResponseDTO reply) {
            response.reply = reply;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            response.createdAt = createdAt;
            return this;
        }

        public ReviewResponseDTO build() {
            return response;
        }
    }
}
