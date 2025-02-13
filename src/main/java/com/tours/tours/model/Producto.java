package com.tours.tours.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Autoincremento

    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private LocalDate fecha;

    @ElementCollection
    private List<String> imagenes;
}
