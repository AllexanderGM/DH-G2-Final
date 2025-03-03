package com.tours.application.controllers;

import com.tours.application.handlers.ResponseHandler;
import com.tours.domain.dto.response.FormatResponseDTO;
import com.tours.domain.dto.user.AuthRequestDTO;
import com.tours.domain.dto.user.UserRequestDTO;
import com.tours.domain.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<FormatResponseDTO> register(UserRequestDTO newUser) {
        FormatResponseDTO response = ResponseHandler.format(
                "Registrar usuario",
                false,
                () -> authService.register(newUser)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<FormatResponseDTO> login(AuthRequestDTO user) {
        FormatResponseDTO response = ResponseHandler.format(
                "Iniciar sesión",
                false,
                () -> authService.login(user)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<FormatResponseDTO> refresh(String user) {
        FormatResponseDTO response = ResponseHandler.format(
                "Iniciar sesión",
                false,
                () -> {
                    try {
                        return authService.refreshToken(user);
                    } catch (BadRequestException e) {
                        throw new RuntimeException(e);
                    }
                }
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<FormatResponseDTO> logout(String token) {
        FormatResponseDTO response = ResponseHandler.format(
                "Desloguear usuario",
                false,
                () -> authService.logout(token)
        );

        if (response.success()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
