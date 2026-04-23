package com.hagiang.localexperience.experience.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hagiang.localexperience.common.dto.PageResponse;
import com.hagiang.localexperience.common.exception.ResourceNotFoundException;
import com.hagiang.localexperience.common.exception.ForbiddenException;
import com.hagiang.localexperience.auth.entity.User;
import com.hagiang.localexperience.auth.entity.Role;
import com.hagiang.localexperience.auth.repository.UserRepository;
import com.hagiang.localexperience.experience.dto.CategoryResponseDTO;
import com.hagiang.localexperience.experience.dto.ExperienceItineraryDayDTO;
import com.hagiang.localexperience.experience.dto.ExperienceRequest;
import com.hagiang.localexperience.experience.dto.ExperienceItinerarySlotDTO;
import com.hagiang.localexperience.experience.dto.ExperienceResponseDTO;
import com.hagiang.localexperience.experience.dto.ReplyRequestDTO;
import com.hagiang.localexperience.experience.dto.ReviewRequestDTO;
import com.hagiang.localexperience.experience.dto.ReviewReplyResponseDTO;
import com.hagiang.localexperience.experience.dto.ReviewResponseDTO;
import com.hagiang.localexperience.experience.entity.Category;
import com.hagiang.localexperience.experience.entity.Experience;
import com.hagiang.localexperience.experience.entity.ExperienceImage;
import com.hagiang.localexperience.experience.entity.ExperienceItinerary;
import com.hagiang.localexperience.experience.entity.Review;
import com.hagiang.localexperience.experience.repository.CategoryRepository;
import com.hagiang.localexperience.experience.repository.ExperienceRepository;
import com.hagiang.localexperience.experience.repository.ReviewRepository;
import com.hagiang.localexperience.experience.repository.ExperienceSpecifications;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ExperienceService {

    private static final TypeReference<List<String>> STRING_LIST_TYPE = new TypeReference<>() {
    };

    private final ExperienceRepository experienceRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ObjectMapper objectMapper;
    private final FileStorageService fileStorageService;

    public ExperienceService(
            ExperienceRepository experienceRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            ReviewRepository reviewRepository,
            ObjectMapper objectMapper,
            FileStorageService fileStorageService
    ) {
        this.experienceRepository = experienceRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.objectMapper = objectMapper;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public ExperienceResponseDTO createExperience(ExperienceRequest request, MultipartFile[] files, Long userId) {
        validateRequest(request, files);

        List<String> storedImageUrls = fileStorageService.storeFiles(Arrays.asList(files));
        if (storedImageUrls.isEmpty()) {
            throw new IllegalArgumentException("At least one image file is required");
        }

        Experience experience = new Experience();
        experience.setTitle(request.getTitle());
        experience.setDescription(request.getDescription());
        experience.setContentDetail(request.getContentDetail());
        experience.setActivities(writeJson(request.getActivities()));
        experience.setHighlights(writeJson(request.getHighlights()));
        experience.setItineraries(toItineraryEntities(request.getItinerary()));
        experience.setDuration(request.getDuration());
        experience.setPrice(request.getPrice());
        experience.setAddress(request.getAddress());
        experience.setMapsPlaceId(request.getMapsPlaceId());
        experience.setLatitude(request.getLatitude());
        experience.setLongitude(request.getLongitude());
        experience.setCategories(resolveCategories(request.getCategoryIds(), request.getCategorySlugs()));
        experience.setAuthor(getAuthorizedLocalHost(userId));

        Experience savedExperience = experienceRepository.saveAndFlush(experience);

        for (String imageUrl : storedImageUrls) {
            savedExperience.addImage(new ExperienceImage(imageUrl));
        }

        Experience updatedExperience = experienceRepository.save(savedExperience);
        return toResponse(updatedExperience);
    }

    @Transactional(readOnly = true)
    public List<ExperienceResponseDTO> getAllExperiences() {
        return experienceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExperienceResponseDTO> getMyExperiences(Long userId) {
        User currentUser = getAuthorizedLocalHost(userId);
        return experienceRepository.findAllByAuthorOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<ExperienceResponseDTO> searchExperiences(
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            List<String> categorySlugs,
            String sort,
            int page,
            int size
    ) {
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("minPrice must be less than or equal to maxPrice");
        }

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        String normalizedKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        Pageable pageable = PageRequest.of(safePage, safeSize, resolveSort(sort));

        return PageResponse.from(
                experienceRepository.findAll(
                                ExperienceSpecifications.search(normalizedKeyword, minPrice, maxPrice, categorySlugs),
                                pageable
                        )
                        .map(this::toResponse)
        );
    }

    private Sort resolveSort(String sort) {
        if (!StringUtils.hasText(sort) || "newest".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        if ("price-asc".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.ASC, "price").and(Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        if ("price-desc".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.DESC, "price").and(Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        return Sort.by(Sort.Direction.DESC, "createdAt");
    }

    @Transactional(readOnly = true)
    public ExperienceResponseDTO getExperienceById(Long id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id: " + id));
        return toResponse(experience);
    }

    @Transactional
    public ReviewResponseDTO createOrUpdateReview(Long experienceId, ReviewRequestDTO request, Long userId) {
        validateReviewRequest(request);

        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id: " + experienceId));
        User user = getUserById(userId);
        if (experience.getAuthor() != null && experience.getAuthor().getId().equals(user.getId())) {
            throw new ForbiddenException("Bạn không thể tự đánh giá trải nghiệm của chính mình");
        }

        Review review = reviewRepository.findByExperienceAndUserAndParentIsNull(experience, user)
                .orElseGet(() -> {
                    Review newReview = new Review();
                    newReview.setExperience(experience);
                    newReview.setUser(user);
                    newReview.setParent(null);
                    return newReview;
                });

        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());

        return toReviewResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponseDTO createReply(Long experienceId, Long reviewId, ReplyRequestDTO request, Long currentUserId) {
        validateReplyRequest(request);

        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id: " + experienceId));
        if (experience.getAuthor() == null || !experience.getAuthor().getId().equals(currentUserId)) {
            throw new ForbiddenException("Only the host of this experience can reply to reviews");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        if (!review.getExperience().getId().equals(experience.getId())) {
            throw new IllegalArgumentException("Review does not belong to the specified experience");
        }

        if (review.getParent() != null) {
            throw new IllegalArgumentException("Host can only reply to a top-level review");
        }

        if (reviewRepository.findByParent(review).isPresent()) {
            throw new IllegalArgumentException("Each review can only have one host reply");
        }

        Review reply = new Review();
        reply.setExperience(experience);
        reply.setUser(getUserById(currentUserId));
        reply.setParent(review);
        reply.setRating(null);
        reply.setComment(request.getComment().trim());

        reviewRepository.save(reply);
        return toReviewResponse(review);
    }

    @Transactional
    public ExperienceResponseDTO updateExperience(Long id, ExperienceRequest request, MultipartFile[] files, Long userId) {
        validateRequest(request, files != null && files.length > 0 ? files : new MultipartFile[0], files == null || files.length == 0);

        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id: " + id));
        assertOwnership(experience, userId);

        experience.setTitle(request.getTitle());
        experience.setDescription(request.getDescription());
        experience.setContentDetail(request.getContentDetail());
        experience.setActivities(writeJson(request.getActivities()));
        experience.setHighlights(writeJson(request.getHighlights()));
        experience.setItineraries(toItineraryEntities(request.getItinerary()));
        experience.setDuration(request.getDuration());
        experience.setPrice(request.getPrice());
        experience.setAddress(request.getAddress());
        experience.setMapsPlaceId(request.getMapsPlaceId());
        experience.setLatitude(request.getLatitude());
        experience.setLongitude(request.getLongitude());
        experience.setCategories(resolveCategories(request.getCategoryIds(), request.getCategorySlugs()));

        Set<String> retainedImageUrls = (request.getExistingImageUrls() == null ? List.<String>of() : request.getExistingImageUrls())
                .stream()
                .filter(StringUtils::hasText)
                .collect(Collectors.toSet());

        List<ExperienceImage> imagesToRemove = experience.getImages().stream()
                .filter(image -> !retainedImageUrls.contains(image.getImageUrl()))
                .toList();

        if (!imagesToRemove.isEmpty()) {
            fileStorageService.deleteFiles(imagesToRemove.stream().map(ExperienceImage::getImageUrl).toList());
            imagesToRemove.forEach(experience::removeImage);
        }

        boolean hasNewFiles = files != null && Arrays.stream(files).anyMatch(file -> file != null && !file.isEmpty());
        if (hasNewFiles) {
            List<String> newImageUrls = fileStorageService.storeFiles(Arrays.asList(files));
            for (String imageUrl : newImageUrls) {
                experience.addImage(new ExperienceImage(imageUrl));
            }
        }

        if (experience.getImages().isEmpty()) {
            throw new IllegalArgumentException("Experience must have at least one image");
        }

        Experience updatedExperience = experienceRepository.save(experience);
        return toResponse(updatedExperience);
    }

    @Transactional
    public void deleteExperience(Long id, Long userId) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id: " + id));
        assertOwnership(experience, userId);

        List<String> imageUrls = experience.getImages().stream().map(ExperienceImage::getImageUrl).toList();
        experienceRepository.delete(experience);
        fileStorageService.deleteFiles(imageUrls);
    }

    private void validateRequest(ExperienceRequest request, MultipartFile[] files) {
        validateRequest(request, files, false);
    }

    private void validateRequest(ExperienceRequest request, MultipartFile[] files, boolean imagesOptional) {
        if (request == null) {
            throw new IllegalArgumentException("Experience data is required");
        }
        if (!imagesOptional
                && (files == null || files.length == 0 || Arrays.stream(files).noneMatch(file -> file != null && !file.isEmpty()))) {
            throw new IllegalArgumentException("At least one image file is required");
        }
        if (!StringUtils.hasText(request.getTitle())
                || !StringUtils.hasText(request.getDescription())
                || !StringUtils.hasText(request.getContentDetail())
                || !StringUtils.hasText(request.getDuration())
                || request.getPrice() == null) {
            throw new IllegalArgumentException("Missing required experience fields");
        }
    }

    private String writeJson(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values == null ? List.of() : values);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("Unable to serialize list data");
        }
    }

    private List<String> readJson(String json) {
        try {
            return objectMapper.readValue(json, STRING_LIST_TYPE);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("Unable to deserialize list data");
        }
    }

    private ExperienceResponseDTO toResponse(Experience experience) {
        List<Review> reviews = reviewRepository.findAllByExperienceAndParentIsNullOrderByCreatedAtDesc(experience);
        List<ReviewResponseDTO> reviewResponses = reviews.stream()
                .map(this::toReviewResponse)
                .toList();
        double averageRating = reviews.stream()
                .map(Review::getRating)
                .filter(java.util.Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        return ExperienceResponseDTO.builder()
                .id(experience.getId())
                .title(experience.getTitle())
                .description(experience.getDescription())
                .contentDetail(experience.getContentDetail())
                .activities(readJson(experience.getActivities()))
                .highlights(readJson(experience.getHighlights()))
                .itinerary(toItineraryDayDtos(experience.getItineraries()))
                .duration(experience.getDuration())
                .price(experience.getPrice())
                .address(experience.getAddress())
                .mapsPlaceId(experience.getMapsPlaceId())
                .latitude(experience.getLatitude())
                .longitude(experience.getLongitude())
                .categories(experience.getCategories().stream()
                        .sorted(Comparator.comparing(Category::getName))
                        .map(this::toCategoryResponse)
                        .toList())
                .imageUrls(experience.getImages().stream().map(ExperienceImage::getImageUrl).toList())
                .ownerId(experience.getAuthor() != null ? experience.getAuthor().getId() : null)
                .authorName(experience.getAuthor() != null ? experience.getAuthor().getUsername() : null)
                .averageRating(reviews.isEmpty() ? 0.0 : roundToOneDecimal(averageRating))
                .totalReviews(reviews.size())
                .reviews(reviewResponses)
                .createdAt(experience.getCreatedAt())
                .build();
    }

    private ReviewResponseDTO toReviewResponse(Review review) {
        Review reply = reviewRepository.findByParent(review).orElse(null);

        return ReviewResponseDTO.builder()
                .id(review.getId())
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .username(review.getUser() != null ? review.getUser().getUsername() : null)
                .avatarUrl(null)
                .rating(review.getRating())
                .comment(review.getComment())
                .reply(toReplyResponse(reply))
                .createdAt(review.getCreatedAt())
                .build();
    }

    private ReviewReplyResponseDTO toReplyResponse(Review reply) {
        if (reply == null) {
            return null;
        }

        return ReviewReplyResponseDTO.builder()
                .hostName(reply.getUser() != null
                        ? reply.getUser().getUsername()
                        : null)
                .comment(reply.getComment())
                .createdAt(reply.getCreatedAt())
                .build();
    }

    private void validateReviewRequest(ReviewRequestDTO request) {
        if (request == null) {
            throw new IllegalArgumentException("Review data is required");
        }
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (!StringUtils.hasText(request.getComment())) {
            throw new IllegalArgumentException("Comment is required");
        }
    }

    private void validateReplyRequest(ReplyRequestDTO request) {
        if (request == null || !StringUtils.hasText(request.getComment())) {
            throw new IllegalArgumentException("Reply comment is required");
        }
    }

    private double roundToOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private List<ExperienceItinerary> toItineraryEntities(List<ExperienceItineraryDayDTO> itinerary) {
        if (itinerary == null) {
            return List.of();
        }

        return itinerary.stream()
                .filter(day -> day != null)
                .flatMap(day -> {
                    int dayNumber = day.getDay() == null || day.getDay() < 1 ? 1 : day.getDay();
                    List<ExperienceItinerarySlotDTO> slots = day.getSlots() == null ? List.of() : day.getSlots();

                    return slots.stream()
                            .filter(slot -> slot != null
                                    && StringUtils.hasText(slot.getTimeTag())
                                    && StringUtils.hasText(slot.getTitle())
                                    && StringUtils.hasText(slot.getDescription()))
                            .map(slot -> new ExperienceItinerary(
                                    dayNumber,
                                    slot.getTimeTag().trim(),
                                    slot.getTitle().trim(),
                                    slot.getDescription().trim()
                            ));
                })
                .toList();
    }

    private List<ExperienceItineraryDayDTO> toItineraryDayDtos(List<ExperienceItinerary> itineraries) {
        Map<Integer, List<ExperienceItinerary>> grouped = itineraries.stream()
                .sorted(Comparator.comparing(ExperienceItinerary::getDayNumber).thenComparing(ExperienceItinerary::getId, Comparator.nullsLast(Long::compareTo)))
                .collect(Collectors.groupingBy(
                        item -> item.getDayNumber() == null || item.getDayNumber() < 1 ? 1 : item.getDayNumber(),
                        java.util.LinkedHashMap::new,
                        Collectors.toList()
                ));

        return grouped.entrySet().stream()
                .map(entry -> {
                    ExperienceItineraryDayDTO dayDto = new ExperienceItineraryDayDTO();
                    dayDto.setDay(entry.getKey());
                    dayDto.setSlots(entry.getValue().stream().map(this::toItinerarySlotDto).toList());
                    return dayDto;
                })
                .toList();
    }

    private ExperienceItinerarySlotDTO toItinerarySlotDto(ExperienceItinerary itinerary) {
        ExperienceItinerarySlotDTO dto = new ExperienceItinerarySlotDTO();
        dto.setId(itinerary.getId());
        dto.setTimeTag(itinerary.getTimeTag());
        dto.setTitle(itinerary.getTitle());
        dto.setDescription(itinerary.getDescription());
        return dto;
    }

    private CategoryResponseDTO toCategoryResponse(Category category) {
        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getColorCode()
        );
    }

    private Set<Category> resolveCategories(List<Long> categoryIds, List<String> categorySlugs) {
        List<Long> normalizedIds = categoryIds == null
                ? List.of()
                : categoryIds.stream().filter(id -> id != null && id > 0).distinct().toList();

        if (!normalizedIds.isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(normalizedIds);
            if (categories.size() != normalizedIds.size()) {
                Set<Long> foundIds = categories.stream().map(Category::getId).collect(Collectors.toSet());
                List<String> missingIds = normalizedIds.stream()
                        .filter(id -> !foundIds.contains(id))
                        .map(String::valueOf)
                        .toList();
                throw new IllegalArgumentException("Unknown category ids: " + String.join(", ", missingIds));
            }

            return new LinkedHashSet<>(categories);
        }

        List<String> normalizedSlugs = categorySlugs == null
                ? List.of()
                : categorySlugs.stream()
                        .filter(StringUtils::hasText)
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .distinct()
                        .toList();

        if (normalizedSlugs.isEmpty()) {
            return new LinkedHashSet<>();
        }

        List<Category> categories = categoryRepository.findAllBySlugIn(normalizedSlugs);
        if (categories.size() != normalizedSlugs.size()) {
            Set<String> foundSlugs = categories.stream().map(Category::getSlug).collect(Collectors.toSet());
            List<String> missingSlugs = normalizedSlugs.stream()
                    .filter(slug -> !foundSlugs.contains(slug))
                    .toList();
            throw new IllegalArgumentException("Unknown category slugs: " + String.join(", ", missingSlugs));
        }

        return new LinkedHashSet<>(categories);
    }

    private User getUserById(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User id is required");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }

    private void assertOwnership(Experience experience, Long userId) {
        User currentUser = getAuthorizedLocalHost(userId);
        if (experience.getAuthor() == null || !currentUser.getId().equals(experience.getAuthor().getId())) {
            throw new ForbiddenException("You are not allowed to modify this experience");
        }
    }

    private User getAuthorizedLocalHost(Long userId) {
        User user = getUserById(userId);
        if (user.getRole() != Role.ROLE_LOCAL_HOST) {
            throw new ForbiddenException("Only local hosts can manage experiences");
        }
        return user;
    }
}
