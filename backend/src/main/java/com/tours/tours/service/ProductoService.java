package com.tours.tours.service;

import com.tours.tours.exception.NombreDuplicadoException;
import com.tours.tours.exception.RecursoNoEncontradoException;
import com.tours.tours.model.Producto;
import com.tours.tours.repository.ProductoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ProductoService {
    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> obtenerProductosAleatorios(int limite) {
        List<Producto> productos = productoRepository.findAll();
        Collections.shuffle(productos);
        return productos.subList(0, Math.min(limite, productos.size()));
    }

    public Page<Producto> listarProductosPaginados(Pageable pageable) {
        return productoRepository.findAll(pageable);
    }

    public Producto agregarProducto(Producto producto) throws NombreDuplicadoException {
        if (productoRepository.existsByNombre(producto.getNombre())) {
            throw new NombreDuplicadoException("El nombre ya existe");
        }
        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, Producto producto) throws RecursoNoEncontradoException {
        if (!productoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Producto no encontrado");
        }
        producto.setId(id);
        return productoRepository.save(producto);
    }

    public void eliminarProducto(Long id) throws RecursoNoEncontradoException {
        if (!productoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }
}
