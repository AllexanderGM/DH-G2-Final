package com.tours.application.controllers;

import com.tours.domain.dto.favorite.FavoriteRequestDTO;
import com.tours.domain.dto.favorite.FavoriteResponseDTO;
import com.tours.domain.services.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService   favoriteService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<FavoriteResponseDTO> addFavorite(@Valid @RequestBody FavoriteRequestDTO requestDTO) {
        FavoriteResponseDTO responseDTO = favoriteService.addFavorite(requestDTO.getTourId());
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{tourId}")
    public ResponseEntity<Map<String, String>> removeFavorite(@PathVariable Long tourId) {
        favoriteService.removeFavorite(tourId);
        return ResponseEntity.ok(Map.of("message", "Tour eliminado de favoritos"));
    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<FavoriteResponseDTO>> getFavorites() {
        List<FavoriteResponseDTO> favorites = favoriteService.getFavorites();
        return ResponseEntity.ok(favorites);
    }
}
