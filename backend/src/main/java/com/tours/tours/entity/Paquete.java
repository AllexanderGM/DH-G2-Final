package com.tours.tours.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "paquetes")
public class Paquete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Autoincremento
    private Long idPaquete;

    private String nombre;
    private String descripcion;
    private Integer duracion;
    private String destino;
    private Double precio;
    private LocalDate fechaProgramacion;
    @Enumerated(EnumType.STRING)
    private Categoria categoria;
    @ElementCollection
    private List<String> proveedores;
    @ElementCollection
    private List<String> imagenes;
}
