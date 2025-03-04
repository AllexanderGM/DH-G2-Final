package com.tours.domain.dto.user;

public record AuthResponseDTO(
        String image,
        String email,
        String username,
        String role,
        String token
) {
}
