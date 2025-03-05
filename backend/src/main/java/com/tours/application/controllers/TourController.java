package com.tours.application.controllers;

import com.tours.domain.dto.tour.TourRequestDTO;
import com.tours.domain.services.TourService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tours")
public class TourController {
    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

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
    public ResponseEntity<?> add(@RequestBody TourRequestDTO tour) {
        return ResponseEntity.ok(tourService.add(tour));
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
}
