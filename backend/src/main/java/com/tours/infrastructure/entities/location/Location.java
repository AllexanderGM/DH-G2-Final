package com.tours.infrastructure.entities.location;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String image;

    private String region;

    private String country;

    @ElementCollection
    private List<String> city;

    @ElementCollection
    private List<String> phone;
}
