package com.tours.infrastructure.entities.booking;

import com.tours.infrastructure.entities.tour.Tour;
import com.tours.infrastructure.entities.user.User;
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
@Table(name = "bookings")
public class Booting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_tour", nullable = false)
    private Tour tour;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDate creationDate;

    @ManyToOne
    @JoinColumn(name = "id_accommodation", nullable = false)
    private Accommodation accommodation;

    private Integer adults;
    private Integer children;
    private Double price;

    @ManyToOne
    @JoinColumn(name = "id_pago", nullable = false)
    private Pago pago;
}
