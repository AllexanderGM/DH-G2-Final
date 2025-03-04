package com.tours.domain.dto.user;

public record AuthResponseDTO(
        String image,
        String email,
        String name,
        String lastName,
        String role,
        String token
) {
}
