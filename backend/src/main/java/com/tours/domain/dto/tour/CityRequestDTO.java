package com.tours.domain.dto.tour;

import java.util.List;
import java.util.Map;

public record CityRequestDTO(Map<String, List<String>> citiesByCountry) {
    public Map<String, List<String>> getCitiesByCountry() {
        return Map.of();
    }
}
