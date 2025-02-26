package com.tours.tours.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "usuarios")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;
    @NotBlank(message = "El documento es obligatorio")
    private String documento;
    @Pattern(regexp = "\\d{9}", message = "El teléfono debe tener 9 dígitos")
    private String telefono;
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;
    @Email(message = "El correo debe ser válido")
    @Column(unique = true, nullable = false)
    private String correo;
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String contrasena;
    private LocalDate fechaRegistro;
    private String direccion;
    private String departamento;
    @Enumerated(EnumType.STRING)
    @ManyToOne
    @JoinColumn(name = "id_role")
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getRoleName()));
    }

    @Override
    public String getPassword() {
        return contrasena;
    }

    @Override
    public String getUsername() {
        return correo;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Cambia a false si deseas manejar cuentas expiradas
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Cambia a false si deseas bloquear cuentas
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Cambia a false si las credenciales deben expirar
    }

    @Override
    public boolean isEnabled() {
        return true; // Cambia a false si el usuario debe ser deshabilitado
    }
}
