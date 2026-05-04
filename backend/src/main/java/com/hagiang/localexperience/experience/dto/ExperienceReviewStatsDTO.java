package com.hagiang.localexperience.experience.dto;

public class ExperienceReviewStatsDTO {

    private final Long experienceId;
    private final Double averageRating;
    private final Long totalReviews;

    public ExperienceReviewStatsDTO(Long experienceId, Double averageRating, Long totalReviews) {
        this.experienceId = experienceId;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
    }

    public Long getExperienceId() {
        return experienceId;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public Long getTotalReviews() {
        return totalReviews;
    }
}
