package com.tours.infrastructure.entities.booking;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "metodo_pago")
public class MetodoPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombreMetodo;
    private String descripcion;

}
