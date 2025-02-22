package com.tours.tours.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "reservas")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Autoincremento
    private Long idReserva;
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_paquete", nullable = false)
    private Paquete paquete;

    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Integer cantidadAdultos;
    private Integer cantidadNinos;
    private Double precio;
    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "id_pago", nullable = false)
    private Pago pago;
}
