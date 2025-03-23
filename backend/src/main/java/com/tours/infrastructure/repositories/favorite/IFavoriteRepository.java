package com.tours.infrastructure.repositories.favorite;

import com.tours.infrastructure.entities.favorite.Favorite;
import com.tours.infrastructure.entities.tour.Tour;
import com.tours.infrastructure.entities.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IFavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserAndTour(User user, Tour tour);
    List<Favorite> findByUser(User user);

}
