package com.tours.infrastructure.entities.tour;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tours_includes")
public class IncludeTours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String icon;

    private String description;

    public IncludeTours(String type, String icon, String description) {
        this.type = type;
        this.icon = icon;
        this.description = description;
    }
}
