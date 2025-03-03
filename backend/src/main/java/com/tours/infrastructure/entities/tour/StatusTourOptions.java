package com.tours.infrastructure.entities.tour;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum StatusTourOptions {
    ACTIVE("Disponible", "Fechas con cupos"),
    INACTIVE("No disponible", "Fechas sin cupos"),
    CANCELLED("Cancelado", "Fechas canceladas");

    private final String displayName;
    private final String description;

    // Constructor
    StatusTourOptions(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    // Buscar por nombre o displayName
    public static StatusTourOptions lookup(String value) {
        return Arrays.stream(values())
                .filter(tag -> tag.name().equalsIgnoreCase(value) || tag.displayName.equalsIgnoreCase(value))
                .findFirst()
                .orElse(ACTIVE);
    }
}
