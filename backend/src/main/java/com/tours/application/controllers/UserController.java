package com.tours.application.controllers;

import com.tours.application.handlers.ResponseHandler;
import com.tours.domain.dto.response.FormatResponseDTO;

import com.tours.domain.dto.user.AuthRequestDTO;
import com.tours.domain.dto.user.UserModifyDTO;
import com.tours.domain.dto.user.UserRequestDTO;
import com.tours.domain.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{email}")
    public ResponseEntity<FormatResponseDTO> get(String email) {
        FormatResponseDTO response = ResponseHandler.format(
                "Información del usuario",
                false,
                () -> userService.get(email)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/")
    public ResponseEntity<FormatResponseDTO> getList() {
        FormatResponseDTO response = ResponseHandler.format(
                "Listar usuarios",
                false,
                userService::getList
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/{email}")
    public ResponseEntity<FormatResponseDTO> update(String email, UserModifyDTO user) {
        FormatResponseDTO response = ResponseHandler.format(
                "Actualizar usuario",
                false,
                () -> userService.update(email, user)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body(response);
        }
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<FormatResponseDTO> delete(String email) {
        FormatResponseDTO response = ResponseHandler.format(
                "Eliminar usuario",
                false,
                () -> userService.delete(email)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
