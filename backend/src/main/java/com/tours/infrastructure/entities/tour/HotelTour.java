package com.tours.infrastructure.entities.tour;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "hoteles")
public class HotelTour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String stars;

    @ManyToOne
    @JoinColumn(name = "destination_id")
    private DestinationTour destinationTour;
}
