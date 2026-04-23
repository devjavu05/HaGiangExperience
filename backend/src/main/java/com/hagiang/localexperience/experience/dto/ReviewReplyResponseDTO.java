package com.hagiang.localexperience.experience.dto;

import java.time.LocalDateTime;

public class ReviewReplyResponseDTO {

    private String hostName;
    private String comment;
    private LocalDateTime createdAt;

    public String getHostName() {
        return hostName;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final ReviewReplyResponseDTO response = new ReviewReplyResponseDTO();

        public Builder hostName(String hostName) {
            response.hostName = hostName;
            return this;
        }

        public Builder comment(String comment) {
            response.comment = comment;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            response.createdAt = createdAt;
            return this;
        }

        public ReviewReplyResponseDTO build() {
            return response;
        }
    }
}
