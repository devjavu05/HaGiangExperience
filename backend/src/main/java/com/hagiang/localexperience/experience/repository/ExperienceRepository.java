package com.hagiang.localexperience.experience.repository;

import com.hagiang.localexperience.auth.entity.User;
import com.hagiang.localexperience.experience.entity.Experience;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ExperienceRepository extends JpaRepository<Experience, Long>, JpaSpecificationExecutor<Experience> {

    List<Experience> findAllByAuthorOrderByCreatedAtDesc(User author);
}
