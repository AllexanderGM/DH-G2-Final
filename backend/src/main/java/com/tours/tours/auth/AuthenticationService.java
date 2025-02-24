package com.tours.tours.auth;

import com.tours.tours.config.JwtService;
import com.tours.tours.entity.Rol;
import com.tours.tours.entity.Usuario;
import com.tours.tours.repository.IUsuarioRepository;
import com.tours.tours.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final PasswordEncoder passwordEncoder;
    private final IUsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RolRepository rolRepository;

    public AuthenticationResponse register (Usuario request){
        Rol rolPorDefecto = rolRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .documento(request.getDocumento())
                .fechaNacimiento(request.getFechaNacimiento())
                .departamento(request.getDepartamento())
                .direccion(request.getDireccion())
                .fechaRegistro(LocalDate.now())
                .telefono(request.getTelefono())
                .correo(request.getCorreo())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .rol(rolPorDefecto)
                .build();

        usuarioRepository.save(usuario);
        String token = jwtService.generateToken(usuario);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    public AuthenticationResponse login(AuthenticationRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getCorreo(),
                        request.getContrasena()
                )
        );
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("No existe el usuario"));
        String token = jwtService.generateToken(usuario);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }
}
