package com.tours.tours.controller;

import com.tours.tours.model.Producto;
import com.tours.tours.service.ProductoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")

public class ProductoController {
    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping("/aleatorios")
    public ResponseEntity<List<Producto>> obtenerProductosAleatorios(@RequestParam(defaultValue = "10") int limite) {
        return ResponseEntity.ok(productoService.obtenerProductosAleatorios(limite));
    }

    @GetMapping("/paginados")
    public ResponseEntity<Page<Producto>> listarProductosPaginados(Pageable pageable) {
        return ResponseEntity.ok(productoService.listarProductosPaginados(pageable));
    }

    @PostMapping
    public ResponseEntity<Producto> agregarProducto(@RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.agregarProducto(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, producto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}

