package com.tours.tours.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String documento;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private UsuarioRole usuarioRole;

}
