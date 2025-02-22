package com.tours.tours.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "hoteles")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHotel;

    private String nombreHotel;
    private String categoriaEstrellas;


}
