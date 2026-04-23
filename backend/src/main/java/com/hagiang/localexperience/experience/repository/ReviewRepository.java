package com.hagiang.localexperience.experience.repository;

import com.hagiang.localexperience.auth.entity.User;
import com.hagiang.localexperience.experience.entity.Experience;
import com.hagiang.localexperience.experience.entity.Review;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findAllByExperienceAndParentIsNullOrderByCreatedAtDesc(Experience experience);

    Optional<Review> findByExperienceAndUserAndParentIsNull(Experience experience, User user);

    Optional<Review> findByParent(Review parent);
}
