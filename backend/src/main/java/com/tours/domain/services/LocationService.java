package com.tours.domain.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tours.domain.dto.tour.CityRequestDTO;
import com.tours.domain.dto.tour.CountryRequestDTO;
import com.tours.infrastructure.entities.location.Location;
import com.tours.infrastructure.entities.tour.DestinationTour;
import com.tours.infrastructure.repositories.location.ILocationRepository;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Data
@Service
public class LocationService {

    private final ObjectMapper objectMapper;
    private final ILocationRepository locationRepository;

    @Transactional
    public void loadDestinations() {
        try {
            if (locationRepository.count() > 0) {
                return;
            }

            // Leer países
            Map<String, CountryRequestDTO> countries = objectMapper.readValue(
                    new ClassPathResource("countries.json").getInputStream(),
                    new TypeReference<>() {}
            );

            // Leer ciudades
            Map<String, List<String>> citiesByCountry = objectMapper.readValue(
                    new ClassPathResource("cities.json").getInputStream(),
                    new TypeReference<>() {}
            );

            for (Map.Entry<String, CountryRequestDTO> entry : countries.entrySet()) {
                CountryRequestDTO country = entry.getValue();

                // Buscar ciudades usando el nombre del país
                List<String> cities = citiesByCountry.getOrDefault(country.name(), new ArrayList<>());

                Location location = new Location();
                location.setRegion(country.region());
                location.setCountry(country.name());
                location.setCity(cities);
                location.setImage(country.image());
                location.setPhone(Optional.ofNullable(country.phone()).orElse(new ArrayList<>()));

                locationRepository.save(location);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
