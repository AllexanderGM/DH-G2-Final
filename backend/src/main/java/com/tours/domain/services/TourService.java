package com.tours.domain.services;

import com.tours.domain.dto.tour.TourRequestDTO;
import com.tours.domain.dto.tour.TourResponseDTO;
import com.tours.exception.DuplicateNameException;
import com.tours.exception.NotFoundException;
import com.tours.infrastructure.entities.location.Location;
import com.tours.infrastructure.entities.tour.*;
import com.tours.infrastructure.repositories.location.ILocationRepository;
import com.tours.infrastructure.repositories.tour.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourService {
    private static final Logger logger = LoggerFactory.getLogger(TourService.class);

    private final ITourRepository tourRepository;
    private final ILocationRepository locationRepository;
    private final IStatusTourRepository statusRepository;
    private final ITagTourRepository tagRepository;
    private final IHotelRepository hotelRepository;
    private final IIncludeRepository includeRepository;

    public List<TourResponseDTO> getAll() {
        List<Tour> data = tourRepository.findAll();
        if (data.isEmpty()) {
            logger.info("No se encontraron tours.");
            return Collections.emptyList();
        }
        return data.stream().map(TourResponseDTO::new).toList();
    }

    public List<TourResponseDTO> getAllRandom(int limit) {
        List<Tour> data = tourRepository.findAll();
        if (data.isEmpty()) {
            return Collections.emptyList();
        }
        Collections.shuffle(data);
        return data.stream().limit(limit).map(TourResponseDTO::new).toList();
    }

    public Optional<TourResponseDTO> getById(Long id) {
        return tourRepository.findById(id).map(TourResponseDTO::new);
    }

    public Page<TourResponseDTO> listPaginated(Pageable pageable) {
        return tourRepository.findAll(pageable).map(TourResponseDTO::new);
    }

    @Transactional
    public Optional<TourResponseDTO> add(TourRequestDTO tour) {
        if (tourRepository.existsByName(tour.name())) {
            throw new DuplicateNameException("El nombre ya existe");
        }

        Tour newTour = createTourEntity(tour);
        Tour savedTour = tourRepository.save(newTour);
        logger.info("Tour agregado exitosamente: {}", savedTour);
        return Optional.of(new TourResponseDTO(savedTour));
    }

    public Optional<TourResponseDTO> update(Long id, TourRequestDTO tour) {
        Tour existingTour = tourRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Paquete no encontrado"));

        Tour updatedTour = createTourEntity(tour);
        updatedTour.setId(existingTour.getId());

        Tour savedTour = tourRepository.save(updatedTour);
        logger.info("Tour actualizado exitosamente: {}", savedTour);
        return Optional.of(new TourResponseDTO(savedTour));
    }

    public void delete(Long id) {
        if (!tourRepository.existsById(id)) {
            throw new NotFoundException("Paquete no encontrado");
        }
        tourRepository.deleteById(id);
        logger.info("Tour eliminado con éxito: {}", id);
    }

    private Tour createTourEntity(TourRequestDTO tour) {
        Location location = locationRepository.findByCountryAndCity(tour.destination().country(), tour.destination().city())
                .orElseThrow(() -> new NotFoundException("Destino no encontrado"));

        StatusTour statusTour = statusRepository.findByStatus(tour.status())
                .orElseThrow(() -> new NotFoundException("Estado no encontrado"));

       // TagTour tag = tagRepository.findByTagTourOptions(tour.tags())
               // .orElseThrow(() -> new NotFoundException("Etiqueta no encontrada"));
        List<TagTour> tagList = tour.tags().stream()
                .map(tag -> tagRepository.findByTagTourOptions(tag)
                        .orElseThrow(() -> new NotFoundException("Etiqueta no encontrada: " + tag)))
                .collect(Collectors.toList());

        HotelTour hotelTour = (tour.hotel() != null) ? hotelRepository.findById(tour.hotel())
                .orElseThrow(() -> new NotFoundException("Hotel no encontrado")) : null;

        List<IncludeTours> includeTours = Optional.ofNullable(tour.includes())
                .orElse(Collections.emptyList())
                .stream()
                .map(dto -> includeRepository.findByType(dto.trim())
                        .orElseThrow(() -> new IllegalArgumentException("Include no encontrado: " + dto.trim())))
                .collect(Collectors.toList());

        Tour newTour= new Tour(
                null, tour.name(), tour.description(), tour.adultPrice(), tour.childPrice(),
                LocalDate.now(), tour.images(), statusTour, null, includeTours,
                new DestinationTour(null, location.getImage(), location.getRegion(), tour.destination().country(), tour.destination().city()),
                hotelTour
        );
        newTour.setTags(tagList); // Ahora `newTour` existe y podemos asignar los tags

        return newTour;
    }
    @Transactional
    public Optional<TourResponseDTO> updateTags(Long id, List<TagTourOptions> tags) {
        Tour existingTour = tourRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tour no encontrado"));

        // Guardamos el tour sin tags primero
        tourRepository.save(existingTour);

        List<TagTour> tagList = tags.stream()
                .map(tag -> tagRepository.findByTagTourOptions(tag)
                        .orElseGet(() -> {
                            TagTour newTag = new TagTour(tag);
                            tagRepository.save(newTag);
                            return newTag;
                        }))
                .collect(Collectors.toList());

        // Ahora asignamos los tags y guardamos nuevamente el Tour
        existingTour.setTags(tagList);
        tourRepository.save(existingTour);

        return Optional.of(new TourResponseDTO(existingTour));
    }

}
