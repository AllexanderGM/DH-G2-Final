package com.tours.application.controllers;

import com.tours.domain.dto.tour.TourRequestDTO;
import com.tours.domain.dto.tour.TourResponseDTO;
import com.tours.domain.dto.tour.filter.TourFilterDTO;
import com.tours.domain.services.FilterTourService;
import com.tours.domain.services.TourService;
import com.tours.infrastructure.entities.tour.TagTourOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tours")
@RequiredArgsConstructor
public class TourController {
    private final TourService tourService;
    private final FilterTourService filterTourService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(tourService.getAll());
    }

    @GetMapping("/random")
    public ResponseEntity<?> getAllRandom(@RequestParam(defaultValue = "10") Integer limit) {
        return ResponseEntity.ok(tourService.getAllRandom(limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getById(id));
    }

    @GetMapping("/paginated")
    public ResponseEntity<?> listPaginated(Pageable pageable) {
        return ResponseEntity.ok(tourService.listPaginated(pageable));
    }

    @PostMapping
    //public ResponseEntity<?> add(@RequestBody TourRequestDTO tour) {
       // return ResponseEntity.ok(tourService.add(tour));
    public ResponseEntity<Optional<TourResponseDTO>> addTour(@Valid @RequestBody TourRequestDTO tourRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tourService.add(tourRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TourRequestDTO tour) {
        return ResponseEntity.ok(tourService.update(id, tour));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        tourService.delete(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{id}/tags")
    public ResponseEntity<?> updateTags(@PathVariable Long id, @RequestBody List<TagTourOptions> tags) {
        return ResponseEntity.ok(tourService.updateTags(id, tags));
    }

    @PostMapping("/filter")
    public Page<TourFilterDTO> buscarTours(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String categoria,
            Pageable pageable) {
        return filterTourService.searchTours(query, categoria, pageable);
    }
}
