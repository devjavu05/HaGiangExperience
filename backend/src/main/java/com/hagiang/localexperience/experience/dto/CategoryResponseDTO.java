package com.hagiang.localexperience.experience.dto;

public class CategoryResponseDTO {

    private Long id;
    private String name;
    private String slug;
    private String colorCode;

    public CategoryResponseDTO() {
    }

    public CategoryResponseDTO(Long id, String name, String slug, String colorCode) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.colorCode = colorCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getColorCode() {
        return colorCode;
    }

    public void setColorCode(String colorCode) {
        this.colorCode = colorCode;
    }
}
