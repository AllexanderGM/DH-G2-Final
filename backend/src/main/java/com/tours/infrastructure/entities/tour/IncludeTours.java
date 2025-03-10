package com.tours.infrastructure.entities.tour;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tour_includes")
public class IncludeTours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String details;

    private String icon;

    private String description;

    @ManyToMany(mappedBy = "includeTours")
    private List<Tour> tours;

    public IncludeTours(String type, String icon, String details, String description) {
        this.type = type;
        this.icon = icon;
        this.details = details;
        this.description = description;
    }
}
