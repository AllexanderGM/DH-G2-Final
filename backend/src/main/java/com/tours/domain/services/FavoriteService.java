package com.tours.domain.services;

import com.tours.domain.dto.favorite.FavoriteResponseDTO;
import com.tours.infrastructure.entities.favorite.Favorite;
import com.tours.infrastructure.entities.tour.Tour;
import com.tours.infrastructure.entities.user.User;
import com.tours.infrastructure.repositories.favorite.IFavoriteRepository;
import com.tours.infrastructure.repositories.tour.ITourRepository;
import com.tours.infrastructure.repositories.user.IUserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final IFavoriteRepository favoriteRepository;
    private final IUserRepository userRepository;
    private final ITourRepository tourRepository;

    public FavoriteResponseDTO addFavorite(Long tourId) {
        // Obtener usuario autenticado
        String email = getAuthenticatedUserEmail();
        User user = getUserByEmail(email);
        Tour tour = getTourById(tourId);

        // Verificar si ya está en favoritos
        if (favoriteRepository.findByUserAndTour(user, tour).isPresent()) {
            throw new IllegalStateException("El tour ya está en favoritos");
        }

        // Guardar favorito
        Favorite favorite = new Favorite(null, user, tour);
        favoriteRepository.save(favorite);

        return new FavoriteResponseDTO(favorite.getId(), user.getId(), tour.getId());
    }

    public void removeFavorite(Long tourId) {
        // Obtener usuario autenticado
        String email = getAuthenticatedUserEmail();
        User user = getUserByEmail(email);
        Tour tour = getTourById(tourId);

        // Buscar favorito y eliminarlo
        Favorite favorite = favoriteRepository.findByUserAndTour(user, tour)
                .orElseThrow(() -> new IllegalStateException("El tour no está en favoritos"));
        favoriteRepository.delete(favorite);
    }

    // Métodos auxiliares para mejorar la claridad del código
    private String getAuthenticatedUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    private Tour getTourById(Long tourId) {
        return tourRepository.findById(tourId)
                .orElseThrow(() -> new EntityNotFoundException("Tour no encontrado"));
    }
    public List<FavoriteResponseDTO> getFavorites() {
        // Obtener usuario autenticado
        String email = getAuthenticatedUserEmail();
        User user = getUserByEmail(email);

        // Buscar favoritos del usuario
        List<Favorite> favorites = favoriteRepository.findByUser(user);

        // Convertir a DTOs
        return favorites.stream()
                .map(fav -> new FavoriteResponseDTO(fav.getId(), fav.getUser().getId(), fav.getTour().getId()))
                .collect(Collectors.toList());
    }
}
