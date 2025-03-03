package com.tours.application.controllers;

import com.tours.application.handlers.ResponseHandler;
import com.tours.domain.dto.response.FormatResponseDTO;
import com.tours.domain.services.InfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/")
public class InfoController {

    private final InfoService infoService;

    @GetMapping
    public ResponseEntity<FormatResponseDTO> getInfoGeneral() {
        FormatResponseDTO response = ResponseHandler.format(
                "Información general de la API",
                false,
                infoService::getInfoGeneral
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/system")
    public ResponseEntity<FormatResponseDTO> getInfoSystem() {
        FormatResponseDTO response = ResponseHandler.format(
                "Información del sistema",
                false,
                infoService::getInfoSystem
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
