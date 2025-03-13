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
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate availableDate;

    @Column(nullable = false)
    private Integer availableSlots;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Column(nullable = false)
    private LocalDateTime returnTime;

    @ManyToOne
    @JoinColumn(name = "id_tour")
    private Tour tour;
}
