package com.hagiang.localexperience.experience.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ExperienceResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String contentDetail;
    private List<String> activities;
    private List<String> highlights;
    private List<ExperienceItineraryDayDTO> itinerary;
    private String duration;
    private BigDecimal price;
    private String address;
    private String mapsPlaceId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private List<CategoryResponseDTO> categories;
    private List<String> imageUrls;
    private Long ownerId;
    private String authorName;
    private String authorPhoneNumber;
    private Double averageRating;
    private Integer totalReviews;
    private List<ReviewResponseDTO> reviews;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getContentDetail() {
        return contentDetail;
    }

    public List<String> getActivities() {
        return activities;
    }

    public List<String> getHighlights() {
        return highlights;
    }

    public List<ExperienceItineraryDayDTO> getItinerary() {
        return itinerary;
    }

    public String getDuration() {
        return duration;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public String getAddress() {
        return address;
    }

    public String getMapsPlaceId() {
        return mapsPlaceId;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public List<CategoryResponseDTO> getCategories() {
        return categories;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getAuthorPhoneNumber() {
        return authorPhoneNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public List<ReviewResponseDTO> getReviews() {
        return reviews;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private final ExperienceResponseDTO response = new ExperienceResponseDTO();

        public Builder id(Long id) {
            response.id = id;
            return this;
        }

        public Builder title(String title) {
            response.title = title;
            return this;
        }

        public Builder description(String description) {
            response.description = description;
            return this;
        }

        public Builder contentDetail(String contentDetail) {
            response.contentDetail = contentDetail;
            return this;
        }

        public Builder activities(List<String> activities) {
            response.activities = activities;
            return this;
        }

        public Builder highlights(List<String> highlights) {
            response.highlights = highlights;
            return this;
        }

        public Builder itinerary(List<ExperienceItineraryDayDTO> itinerary) {
            response.itinerary = itinerary;
            return this;
        }

        public Builder duration(String duration) {
            response.duration = duration;
            return this;
        }

        public Builder price(BigDecimal price) {
            response.price = price;
            return this;
        }

        public Builder address(String address) {
            response.address = address;
            return this;
        }

        public Builder mapsPlaceId(String mapsPlaceId) {
            response.mapsPlaceId = mapsPlaceId;
            return this;
        }

        public Builder latitude(BigDecimal latitude) {
            response.latitude = latitude;
            return this;
        }

        public Builder longitude(BigDecimal longitude) {
            response.longitude = longitude;
            return this;
        }

        public Builder categories(List<CategoryResponseDTO> categories) {
            response.categories = categories;
            return this;
        }

        public Builder imageUrls(List<String> imageUrls) {
            response.imageUrls = imageUrls;
            return this;
        }

        public Builder ownerId(Long ownerId) {
            response.ownerId = ownerId;
            return this;
        }

        public Builder authorName(String authorName) {
            response.authorName = authorName;
            return this;
        }

        public Builder authorPhoneNumber(String authorPhoneNumber) {
            response.authorPhoneNumber = authorPhoneNumber;
            return this;
        }

        public Builder averageRating(Double averageRating) {
            response.averageRating = averageRating;
            return this;
        }

        public Builder totalReviews(Integer totalReviews) {
            response.totalReviews = totalReviews;
            return this;
        }

        public Builder reviews(List<ReviewResponseDTO> reviews) {
            response.reviews = reviews;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            response.createdAt = createdAt;
            return this;
        }

        public ExperienceResponseDTO build() {
            return response;
        }
    }
}
