package com.hagiang.localexperience.experience.dto;

import java.util.List;

public class ExperienceItineraryDayDTO {

    private Integer day;
    private List<ExperienceItinerarySlotDTO> slots;

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public List<ExperienceItinerarySlotDTO> getSlots() {
        return slots;
    }

    public void setSlots(List<ExperienceItinerarySlotDTO> slots) {
        this.slots = slots;
    }
}
