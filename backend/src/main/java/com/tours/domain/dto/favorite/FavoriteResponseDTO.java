package com.tours.domain.dto.favorite;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteResponseDTO {
    private Long id;
    private Long userId;
    private Long tourId;
}
