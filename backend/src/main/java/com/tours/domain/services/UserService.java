package com.tours.domain.services;

import com.tours.domain.dto.response.MessageResponseDTO;
import com.tours.domain.dto.user.UserModifyDTO;
import com.tours.domain.dto.user.UserResponseDTO;
import com.tours.exception.UnauthorizedException;
import com.tours.infrastructure.entities.user.Role;
import com.tours.infrastructure.entities.user.User;
import com.tours.infrastructure.entities.user.UserRol;
import com.tours.infrastructure.repositories.user.IRoleUserRepository;
import com.tours.infrastructure.repositories.user.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final Map<String, String> tokenBlacklist = new ConcurrentHashMap<>();
    private final IUserRepository userRepository;
    private final IRoleUserRepository rolRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserResponseDTO get(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));
        logger.info("Usuario encontrado correctamente {}", user.getEmail());
        return new UserResponseDTO(user);
    }

    public List<UserResponseDTO> getList() {
        List<User> users = userRepository.findAll();
        logger.info("Usuarios encontrados correctamente");
        return users.stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }

    public UserResponseDTO update(String email, UserModifyDTO userRequestDTO) {
        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> {
                logger.error("Error: Usuario con email {} no encontrado", email);
                return new UnauthorizedException("Usuario no encontrado");
            });

            Role role = rolRepository
                    .findByUserRol(UserRol.lookup(userRequestDTO.role()))
                    .orElseThrow(() -> {
                        logger.error("Error: Rol {} no encontrado para el usuario", userRequestDTO.role());
                        return new UnauthorizedException("Rol no encontrado");
                    });

            user.setImage(userRequestDTO.image());
            user.setEmail(userRequestDTO.email());
            user.setName(userRequestDTO.name());
            user.setLastname(userRequestDTO.lastName());
            user.setDocument(userRequestDTO.document());
            user.setPhone(userRequestDTO.phone());
            user.setDateOfBirth(userRequestDTO.dateOfBirth());
            user.setEmail(userRequestDTO.email());
            user.setPassword(bCryptPasswordEncoder.encode(userRequestDTO.password()));
            user.setAddress(userRequestDTO.address());
            user.setCity(userRequestDTO.city());
            user.setRole(role);

            User userEdit = userRepository.save(user);
            logger.info("Usuario actualizado correctamente {}", user.getEmail());
            return new UserResponseDTO(userEdit);

        } catch (UnauthorizedException e) {
            logger.error("Error al actualizar el usuario: {}", e.getMessage());
            throw e;
        }
    }

    public MessageResponseDTO delete(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));
        userRepository.delete(user);
        logger.info("Usuario eliminado correctamente {}", user.getEmail());
        return new MessageResponseDTO("Usuario eliminado correctamente");
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void cleanBlacklist() {
        tokenBlacklist.clear();
    }
}
