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
    public ResponseEntity<?> getInfoGeneral() {
        return ResponseEntity.ok(infoService.getInfoGeneral());
    }

    @GetMapping("/system")
    public ResponseEntity<?> getInfoSystem() {
        return ResponseEntity.ok(infoService.getInfoSystem());
    }
}
