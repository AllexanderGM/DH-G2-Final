package com.tours.domain.services;

import com.tours.domain.dto.tour.TourRequestDTO;
import com.tours.domain.dto.tour.TourResponseDTO;
import com.tours.exception.DuplicateNameException;
import com.tours.exception.NotFoundException;
import com.tours.infrastructure.entities.tour.*;
import com.tours.infrastructure.repositories.tour.*;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Data
@Service
public class TourService {
    private static final Logger logger = LoggerFactory.getLogger(TourService.class);

    private final ITourRepository tourRepository;
    private final IDestinationRepository destinationRepository;
    private final IStatusTourRepository statusRepository;
    private final ITagTourRepository tagRepository;
    private final IHotelRepository hotelRepository;
    private final IIncludeRepository includeRepository;


    public List<TourResponseDTO> getAll() {
        try {
            List<Tour> data = tourRepository.findAll();
            if (data.isEmpty()) {
                logger.info("No se encontraron tours.");
                return Collections.emptyList();
            }

            List<TourResponseDTO> response = data.stream()
                    .map(TourResponseDTO::new)
                    .toList();

            logger.info("Tours encontrados: {}", response);
            return response;
        } catch (Exception e) {
            logger.error("Error al obtener todos los tours", e);
            return Collections.emptyList();
        }
    }

    public List<TourResponseDTO> getAllRandom(Integer limit) {
        try {
            List<Tour> data = tourRepository.findAll();
            if (data.isEmpty()) {
                return Collections.emptyList();
            }

            Collections.shuffle(data);
            List<TourResponseDTO> response = data.stream()
                    .limit(limit)
                    .map(TourResponseDTO::new)
                    .toList();

            logger.info("Tours aleatorios encontrados: {}", response);
            return response;
        } catch (Exception e) {
            logger.error("Error al obtener tours aleatorios", e);
            return Collections.emptyList();
        }
    }

    public Optional<TourResponseDTO> getById(Long id) {
        Optional<Tour> data = tourRepository.findById(id);

        if (data.isPresent()) {
            logger.info("Tour encontrado: {}", data.get());
            return Optional.of(new TourResponseDTO(data.get()));
        } else {
            logger.warn("Tour no encontrado con ID: {}", id);
            return Optional.empty();
        }
    }

    public Page<TourResponseDTO> listPaginated(Pageable pageable) {
        try {
            Page<Tour> data = tourRepository.findAll(pageable);
            logger.info("Tours paginados encontrados: {}", data.getContent());
            return data.map(TourResponseDTO::new);
        } catch (Exception e) {
            logger.error("Error al listar tours paginados", e);
            return Page.empty();
        }
    }

    public Optional<TourResponseDTO> add(TourRequestDTO tour) throws DuplicateNameException {
        try {
            if (tourRepository.existsByName(tour.name())) {
                throw new DuplicateNameException("El nombre ya existe");
            }

            // Validar y obtener entidades relacionadas
            DestinationTour destinationTour = destinationRepository.findByCity(tour.destination().city())
                    .orElseThrow(() -> new IllegalArgumentException("Destino no encontrado"));

            StatusTour statusTour = statusRepository.findByStatus(tour.status())
                    .orElseThrow(() -> new IllegalArgumentException("Estado no encontrado"));

            TagTour tag = tagRepository.findByTagTourOptions(tour.tag())
                    .orElseThrow(() -> new IllegalArgumentException("Etiqueta no encontrada"));

            HotelTour hotelTour = tour.hotel() != null ? hotelRepository.findById(tour.hotel())
                    .orElseThrow(() -> new IllegalArgumentException("Hotel no encontrado")) : null;

            // Evitar que la lista de includes sea null
            List<IncludeTours> includeTours = (tour.includes() != null)
                    ? tour.includes().stream()
                    .map(dto -> includeRepository.findByType(dto.trim())
                            .orElseThrow(() -> new IllegalArgumentException(STR."Include no encontrado: \{dto.trim()}")))
                    .toList()
                    : List.of();

            // Crear instancia de Tour
            Tour newTour = new Tour(
                    null,
                    tour.name(),
                    tour.description(),
                    tour.adultPrice(),
                    tour.childPrice(),
                    LocalDate.now(),
                    tour.images(),
                    statusTour,
                    tag,
                    includeTours,
                    destinationTour,
                    hotelTour
            );

            // Guardar Tour
            Tour savedTour = tourRepository.save(newTour);
            logger.info("Tour agregado exitosamente: {}", savedTour);

            return Optional.of(new TourResponseDTO(savedTour));
        } catch (DuplicateNameException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            logger.warn("Error de validación al agregar un tour: {}", e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            logger.error("Error inesperado al agregar un tour", e);
            return Optional.empty();
        }
    }

    public Optional<TourResponseDTO> update(Long id, TourRequestDTO tour) throws NotFoundException {
        try {
            // Verificar si el tour existe
            Tour existingTour = tourRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Paquete no encontrado"));

            // Verificar entidades relacionadas
            DestinationTour destinationTour = destinationRepository.findByCity(tour.destination().city())
                    .orElseThrow(() -> new IllegalArgumentException("Destino no encontrado"));

            StatusTour statusTour = statusRepository.findByStatus(tour.status())
                    .orElseThrow(() -> new IllegalArgumentException("Estado no encontrado"));

            TagTour tag = tagRepository.findByTagTourOptions(tour.tag())
                    .orElseThrow(() -> new IllegalArgumentException("Etiqueta no encontrada"));

            HotelTour hotelTour = (tour.hotel() != null)
                    ? hotelRepository.findById(tour.hotel())
                    .orElseThrow(() -> new IllegalArgumentException("Hotel no encontrado"))
                    : null;

            // Convertir los IncludeDTO en Include
            List<IncludeTours> includeTours = (tour.includes() != null)
                    ? tour.includes().stream()
                    .map(dto -> includeRepository.findByType(dto.trim())
                            .orElseThrow(() -> new IllegalArgumentException(STR."Include no encontrado: \{dto.trim()}")))
                    .toList()
                    : List.of();

            // Actualizar los datos del Tour existente
            existingTour.setName(tour.name());
            existingTour.setDescription(tour.description());
            existingTour.setAdultPrice(tour.adultPrice());
            existingTour.setChildPrice(tour.childPrice());
            existingTour.setImages(tour.images());
            existingTour.setStatusTour(statusTour);
            existingTour.setTag(tag);
            existingTour.setIncludeTours(includeTours);
            existingTour.setDestinationTour(destinationTour);
            existingTour.setHotelTour(hotelTour);

            // Guardar cambios en la base de datos
            Tour updatedTour = tourRepository.save(existingTour);
            logger.info("Tour actualizado exitosamente: {}", updatedTour);

            return Optional.of(new TourResponseDTO(updatedTour));

        } catch (IllegalArgumentException e) {
            logger.warn("Error de validación al actualizar el tour: {}", e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            logger.error("Error inesperado al actualizar el tour", e);
            return Optional.empty();
        }
    }

    public String delete(Long id) throws NotFoundException {
        if (!tourRepository.existsById(id)) {
            throw new NotFoundException("Paquete no encontrado");
        }
        tourRepository.deleteById(id);
        logger.info("Tour eliminado con éxito: {}", id);
        return "Tour eliminado con éxito";
    }
}
