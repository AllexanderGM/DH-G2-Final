package com.tours.infrastructure.entities.tour;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tour_tags")
public class TagTour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag", nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private TagTourOptions tagTourOptions;

    public TagTour(TagTourOptions tagTourOptions) {
        this.tagTourOptions = tagTourOptions;
    }
}
