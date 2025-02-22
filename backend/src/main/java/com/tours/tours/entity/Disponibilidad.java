package com.tours.tours.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "disponibilidad")
public class Disponibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDisponibilidad;

    private LocalDate fechaDisponible;
    private Integer cuposDisponibles;
    private LocalDateTime horaSalida;
    private LocalDateTime horaRegreso;

    @ManyToOne
    @JoinColumn(name = "id_paquete")
    private Paquete paquete;
}
