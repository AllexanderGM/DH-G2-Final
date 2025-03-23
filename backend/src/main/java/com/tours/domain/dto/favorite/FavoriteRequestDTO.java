package com.tours.domain.dto.favorite;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteRequestDTO {
    @NotNull(message = "El ID del tour no puede ser nulo")
    private Long tourId;
}
