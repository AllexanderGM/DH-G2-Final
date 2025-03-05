package com.tours.infrastructure.entities.booking;

import com.tours.infrastructure.entities.tour.Tour;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "disponibilidad")
public class Disponibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaDisponible;
    private Integer cuposDisponibles;
    private LocalDateTime horaSalida;
    private LocalDateTime horaRegreso;

    @ManyToOne
    @JoinColumn(name = "id_paquete")
    private Tour paquete;
}
