package com.hagiang.localexperience.experience.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hagiang.localexperience.common.dto.PageResponse;
import com.hagiang.localexperience.experience.dto.ExperienceRequest;
import com.hagiang.localexperience.experience.dto.ExperienceResponseDTO;
import com.hagiang.localexperience.experience.dto.ReplyRequestDTO;
import com.hagiang.localexperience.experience.dto.ReviewRequestDTO;
import com.hagiang.localexperience.experience.dto.ReviewResponseDTO;
import com.hagiang.localexperience.experience.service.ExperienceService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final ExperienceService experienceService;
    private final ObjectMapper objectMapper;

    public ExperienceController(ExperienceService experienceService, ObjectMapper objectMapper) {
        this.experienceService = experienceService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ExperienceResponseDTO> createExperience(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("experience") String experienceJson
    ) {
        ExperienceRequest request = parseExperienceRequest(experienceJson);
        ExperienceResponseDTO response = experienceService.createExperience(request, files, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ExperienceResponseDTO> updateExperience(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart("experience") String experienceJson
    ) {
        ExperienceRequest request = parseExperienceRequest(experienceJson);
        return ResponseEntity.ok(experienceService.updateExperience(id, request, files, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId
    ) {
        experienceService.deleteExperience(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ExperienceResponseDTO>> getAllExperiences() {
        return ResponseEntity.ok(experienceService.getAllExperiences());
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<ExperienceResponseDTO>> searchExperiences(
            @RequestParam(value = "q", required = false) String keyword,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "categorySlugs", required = false) List<String> categorySlugs,
            @RequestParam(value = "sort", defaultValue = "newest") String sort,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(
                experienceService.searchExperiences(keyword, minPrice, maxPrice, categorySlugs, sort, page, size)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<List<ExperienceResponseDTO>> getMyExperiences(
            @RequestHeader(value = "X-User-Id", required = false) Long userId
    ) {
        return ResponseEntity.ok(experienceService.getMyExperiences(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExperienceResponseDTO> getExperienceById(@PathVariable Long id) {
        return ResponseEntity.ok(experienceService.getExperienceById(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponseDTO> createOrUpdateReview(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody ReviewRequestDTO request
    ) {
        return ResponseEntity.ok(experienceService.createOrUpdateReview(id, request, userId));
    }

    @PostMapping("/{experienceId}/reviews/{reviewId}/reply")
    public ResponseEntity<ReviewResponseDTO> createReply(
            @PathVariable Long experienceId,
            @PathVariable Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody ReplyRequestDTO request
    ) {
        return ResponseEntity.ok(experienceService.createReply(experienceId, reviewId, request, userId));
    }

    private ExperienceRequest parseExperienceRequest(String experienceJson) {
        try {
            return objectMapper.readValue(experienceJson, ExperienceRequest.class);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("Invalid experience JSON payload");
        }
    }
}
