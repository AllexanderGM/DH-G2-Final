package com.tours.tours.service;
import com.tours.tours.entity.Rol;
import com.tours.tours.entity.Usuario;
import com.tours.tours.exception.CorreoExisteException;
import com.tours.tours.exception.NombreDuplicadoException;
import com.tours.tours.repository.RolRepository;
import com.tours.tours.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService  implements UserDetailsService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    //@Autowired
    //private PasswordEncoder passwordEncoder;

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new UsernameNotFoundException("El correo ya está registrado.");
        }
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        usuario.setFechaRegistro(LocalDate.now());
        Rol rolPorDefecto = rolRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        usuario.setRol(rolPorDefecto);

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioDetalles) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(usuarioDetalles.getNombre());
            usuario.setApellido(usuarioDetalles.getApellido());
            usuario.setDocumento(usuarioDetalles.getDocumento());
            usuario.setTelefono(usuarioDetalles.getTelefono());
            usuario.setFechaNacimiento(usuarioDetalles.getFechaNacimiento());
            usuario.setCorreo(usuarioDetalles.getCorreo());
            usuario.setDireccion(usuarioDetalles.getDireccion());
            usuario.setDepartamento(usuarioDetalles.getDepartamento());
            usuario.setRol(usuarioDetalles.getRol());
            return usuarioRepository.save(usuario);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //como resolvemos?
        Optional<Usuario> usuarioBuscado= usuarioRepository.findByCorreo(username);
        if(usuarioBuscado.isPresent()){
            return (UserDetails) usuarioBuscado.get();
        }else{
            throw new UsernameNotFoundException("usuario inexistente: "+username);
        }

    }
}