package com.hagiang.localexperience.experience.entity;

import com.hagiang.localexperience.auth.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "content_detail", nullable = false, columnDefinition = "LONGTEXT")
    private String contentDetail;

    @Column(nullable = false, columnDefinition = "JSON")
    private String activities;

    @Column(nullable = false, columnDefinition = "JSON")
    private String highlights;

    @Column(nullable = false, length = 100)
    private String duration;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(length = 500)
    private String address;

    @Column(name = "maps_place_id", length = 255)
    private String mapsPlaceId;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    @OneToMany(
            mappedBy = "experience",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<ExperienceImage> images = new ArrayList<>();

    @OneToMany(
            mappedBy = "experience",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<ExperienceItinerary> itineraries = new ArrayList<>();

    @OneToMany(
            mappedBy = "experience",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Review> reviews = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "experience_categories",
            joinColumns = @JoinColumn(name = "experience_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new LinkedHashSet<>();

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContentDetail() {
        return contentDetail;
    }

    public void setContentDetail(String contentDetail) {
        this.contentDetail = contentDetail;
    }

    public String getActivities() {
        return activities;
    }

    public void setActivities(String activities) {
        this.activities = activities;
    }

    public String getHighlights() {
        return highlights;
    }

    public void setHighlights(String highlights) {
        this.highlights = highlights;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMapsPlaceId() {
        return mapsPlaceId;
    }

    public void setMapsPlaceId(String mapsPlaceId) {
        this.mapsPlaceId = mapsPlaceId;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public List<ExperienceImage> getImages() {
        return images;
    }

    public void setImages(List<ExperienceImage> images) {
        this.images.clear();
        if (images != null) {
            images.forEach(this::addImage);
        }
    }

    public void addImage(ExperienceImage image) {
        image.setExperience(this);
        this.images.add(image);
    }

    public void removeImage(ExperienceImage image) {
        image.setExperience(null);
        this.images.remove(image);
    }

    public List<ExperienceItinerary> getItineraries() {
        return itineraries;
    }

    public void setItineraries(List<ExperienceItinerary> itineraries) {
        this.itineraries.clear();
        if (itineraries != null) {
            itineraries.forEach(this::addItinerary);
        }
    }

    public void addItinerary(ExperienceItinerary itinerary) {
        itinerary.setExperience(this);
        this.itineraries.add(itinerary);
    }

    public void removeItinerary(ExperienceItinerary itinerary) {
        itinerary.setExperience(null);
        this.itineraries.remove(itinerary);
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories.clear();
        if (categories != null) {
            this.categories.addAll(categories);
        }
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews.clear();
        if (reviews != null) {
            reviews.forEach(this::addReview);
        }
    }

    public void addReview(Review review) {
        review.setExperience(this);
        this.reviews.add(review);
    }

    public void removeReview(Review review) {
        review.setExperience(null);
        this.reviews.remove(review);
    }
}
