package com.tours.application.controllers;

import com.tours.application.handlers.ResponseHandler;
import com.tours.domain.dto.response.FormatResponseDTO;
import com.tours.domain.dto.tour.TourRequestDTO;
import com.tours.domain.services.TourService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tours")
public class TourController {
    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public ResponseEntity<FormatResponseDTO> getAll() {
        FormatResponseDTO response = ResponseHandler.format(
                "Obtener lista de paquetes de tours",
                false,
                tourService::getAll
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @GetMapping("/random")
    public ResponseEntity<FormatResponseDTO> getAllRandom(@RequestParam(defaultValue = "10") Integer limit) {
        FormatResponseDTO response = ResponseHandler.format(
                "Obtener lista de paquetes de tours aleatorios",
                false,
                () -> tourService.getAllRandom(limit)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormatResponseDTO> getById(@PathVariable Long id) {
        FormatResponseDTO response = ResponseHandler.format(
                "Obtener paquete de tour por su id",
                false,
                () -> tourService.getById(id)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @GetMapping("/paginated")
    public ResponseEntity<FormatResponseDTO> listPaginated(Pageable pageable) {
        FormatResponseDTO response = ResponseHandler.format(
                "Obtener lista de paquetes de tours paginados",
                false,
                () -> tourService.listPaginated(pageable)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<FormatResponseDTO> add(@RequestBody TourRequestDTO tour) {
        FormatResponseDTO response = ResponseHandler.format(
                "Agregar paquete de tour",
                false,
                () -> tourService.add(tour)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormatResponseDTO> update(@PathVariable Long id, @RequestBody TourRequestDTO tour) {
        FormatResponseDTO response = ResponseHandler.format(
                "Actualizar paquete de tour",
                false,
                () -> tourService.update(id, tour)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<FormatResponseDTO> delete(@PathVariable Long id) {
        FormatResponseDTO response = ResponseHandler.format(
                "Actualizar paquete de tour",
                false,
                () -> tourService.delete(id)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }
}
