package com.tours.tours.controller;

import com.tours.tours.entity.Paquete;
import com.tours.tours.service.PaqueteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/paquetes")

public class PaqueteController {
    private final PaqueteService paqueteService;

    public PaqueteController(PaqueteService paqueteService) {
        this.paqueteService = paqueteService;
    }

    @GetMapping("/aleatorios")
    public ResponseEntity<List<Paquete>> obtenerPaquetesAleatorios(@RequestParam(defaultValue = "10") int limite) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Usuario: " + auth.getName());
        System.out.println("Roles: " + auth.getAuthorities());
        System.out.println(SecurityContextHolder.getContext().getAuthentication());
        return ResponseEntity.ok(paqueteService.obtenerPaquetesAleatorios(limite));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Paquete>> obtenerDetallePaquete(@PathVariable Long id) {
        return ResponseEntity.ok(paqueteService.obtenerPaquete(id));
    }

    @GetMapping("/paginados")
    public ResponseEntity<Page<Paquete>> listarPaquetesPaginados(Pageable pageable) {
        return ResponseEntity.ok(paqueteService.listarPaquetesPaginados(pageable));
    }

    @PostMapping
    public ResponseEntity<Paquete> agregarPaquete(@RequestBody Paquete paquete) {
        return ResponseEntity.ok(paqueteService.agregarPaquete(paquete));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paquete> actualizarPaquete(@PathVariable Long id, @RequestBody Paquete paquete) {
        return ResponseEntity.ok(paqueteService.actualizarPaquete(id, paquete));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPaquete(@PathVariable Long id) {
        paqueteService.eliminarPaquete(id);
        return ResponseEntity.noContent().build();
    }
}

