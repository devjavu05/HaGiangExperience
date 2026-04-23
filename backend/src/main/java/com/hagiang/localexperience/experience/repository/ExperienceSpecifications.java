package com.hagiang.localexperience.experience.repository;

import com.hagiang.localexperience.experience.entity.Category;
import com.hagiang.localexperience.experience.entity.Experience;
import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ExperienceSpecifications {

    private ExperienceSpecifications() {
    }

    public static Specification<Experience> matchesKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(keyword)) {
                return criteriaBuilder.conjunction();
            }

            String pattern = "%" + keyword.trim().toLowerCase(Locale.ROOT) + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(criteriaBuilder.coalesce(root.get("address"), "")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(criteriaBuilder.coalesce(root.get("activities"), "[]")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(criteriaBuilder.coalesce(root.get("highlights"), "[]")), pattern)
            );
        };
    }

    public static Specification<Experience> hasMinPrice(BigDecimal minPrice) {
        return (root, query, criteriaBuilder) ->
                minPrice == null ? criteriaBuilder.conjunction() : criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Experience> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) ->
                maxPrice == null ? criteriaBuilder.conjunction() : criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Experience> hasCategorySlugs(List<String> categorySlugs) {
        return (root, query, criteriaBuilder) -> {
            List<String> normalizedSlugs = categorySlugs == null
                    ? List.of()
                    : categorySlugs.stream()
                            .filter(StringUtils::hasText)
                            .map(slug -> slug.trim().toLowerCase(Locale.ROOT))
                            .distinct()
                            .toList();

            if (normalizedSlugs.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            query.distinct(true);
            var categoryJoin = root.join("categories");
            return categoryJoin.get("slug").in(normalizedSlugs);
        };
    }

    public static Specification<Experience> search(
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            List<String> categorySlugs
    ) {
        return Specification.where(matchesKeyword(keyword))
                .and(hasMinPrice(minPrice))
                .and(hasMaxPrice(maxPrice))
                .and(hasCategorySlugs(categorySlugs));
    }
}
