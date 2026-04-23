package com.hagiang.localexperience.experience.dto;

import java.math.BigDecimal;
import java.util.List;

public class ExperienceRequest {

    private String title;
    private String description;
    private String contentDetail;
    private List<String> activities;
    private List<String> highlights;
    private List<ExperienceItineraryDayDTO> itinerary;
    private List<String> existingImageUrls;
    private String duration;
    private BigDecimal price;
    private String address;
    private String mapsPlaceId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private List<Long> categoryIds;
    private List<String> categorySlugs;

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

    public List<String> getActivities() {
        return activities;
    }

    public void setActivities(List<String> activities) {
        this.activities = activities;
    }

    public List<String> getHighlights() {
        return highlights;
    }

    public void setHighlights(List<String> highlights) {
        this.highlights = highlights;
    }

    public List<ExperienceItineraryDayDTO> getItinerary() {
        return itinerary;
    }

    public void setItinerary(List<ExperienceItineraryDayDTO> itinerary) {
        this.itinerary = itinerary;
    }

    public List<String> getExistingImageUrls() {
        return existingImageUrls;
    }

    public void setExistingImageUrls(List<String> existingImageUrls) {
        this.existingImageUrls = existingImageUrls;
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

    public List<String> getCategorySlugs() {
        return categorySlugs;
    }

    public void setCategorySlugs(List<String> categorySlugs) {
        this.categorySlugs = categorySlugs;
    }

    public List<Long> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<Long> categoryIds) {
        this.categoryIds = categoryIds;
    }
}
