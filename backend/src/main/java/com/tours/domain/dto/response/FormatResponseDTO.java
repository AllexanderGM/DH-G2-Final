package com.tours.domain.dto.response;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record FormatResponseDTO(
        String timeStamp,
        String message,
        Boolean success,
        Boolean encrypted,
        Object data) {
    public FormatResponseDTO(String message, Boolean success, Boolean encrypted, Object data) {
        this(
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                message,
                success,
                encrypted,
                data
        );
    }
}
