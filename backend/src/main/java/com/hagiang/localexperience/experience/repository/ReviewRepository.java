package com.hagiang.localexperience.experience.repository;

import com.hagiang.localexperience.auth.entity.User;
import com.hagiang.localexperience.experience.dto.ExperienceReviewStatsDTO;
import com.hagiang.localexperience.experience.entity.Experience;
import com.hagiang.localexperience.experience.entity.Review;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findAllByExperienceAndParentIsNullOrderByCreatedAtDesc(Experience experience);

    Optional<Review> findByExperienceAndUserAndParentIsNull(Experience experience, User user);

    Optional<Review> findByParent(Review parent);

    @Query("""
            select new com.hagiang.localexperience.experience.dto.ExperienceReviewStatsDTO(
                r.experience.id,
                avg(r.rating),
                count(r)
            )
            from Review r
            where r.parent is null and r.experience.id in :experienceIds
            group by r.experience.id
            """)
    List<ExperienceReviewStatsDTO> findTopLevelReviewStatsByExperienceIds(@Param("experienceIds") List<Long> experienceIds);
}
