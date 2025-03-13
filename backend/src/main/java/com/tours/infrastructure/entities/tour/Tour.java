package com.tours.infrastructure.entities.tour;

import com.tours.infrastructure.entities.booking.Availability;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tours")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal adultPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal childPrice;

    @Column(nullable = false)
    private LocalDate creationDate;

    @ElementCollection
    private List<String> images;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private StatusTour statusTour;

    @ManyToMany
    @JoinTable(
            name = "tour_tag_relation",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<TagTour> tags = new ArrayList<>();


    @ManyToMany
    @JoinTable(
            name = "tour_include-tours",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "include_tours_id")
    )
    private List<IncludeTours> includeTours;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "destination_id")
    private DestinationTour destinationTour;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private HotelTour hotelTour;
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true) // Changed from "tour" to "pack"
    private List<Availability> availabilities;

}
