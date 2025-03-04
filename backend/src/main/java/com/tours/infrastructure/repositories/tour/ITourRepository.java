package com.tours.infrastructure.repositories.tour;

import com.tours.infrastructure.entities.tour.Tour;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ITourRepository extends JpaRepository<Tour, Long> {
    @NotNull Page<Tour> findAll(@NotNull Pageable pageable);
    boolean existsByName(String name);
}
