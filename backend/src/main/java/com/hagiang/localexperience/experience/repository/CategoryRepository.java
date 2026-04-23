package com.hagiang.localexperience.experience.repository;

import com.hagiang.localexperience.experience.entity.Category;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findBySlug(String slug);

    List<Category> findAllBySlugIn(Collection<String> slugs);
}
