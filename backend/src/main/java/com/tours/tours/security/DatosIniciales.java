package com.tours.tours.security;

import com.tours.tours.entity.Role;
import com.tours.tours.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DatosIniciales implements ApplicationRunner {

    @Autowired
    private RolRepository rolRepository;
    @Override
    public void run(ApplicationArguments args) throws Exception {

        if (rolRepository.findByRoleName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setRoleName("ROLE_ADMIN");
            adminRole.setDescription("Administrador del sistema con acceso total");
            rolRepository.save(adminRole);
        }
        if (rolRepository.findByRoleName("ROLE_USER").isEmpty()) {
        Role userRole = new Role();
        userRole.setRoleName("ROLE_USER");
        userRole.setDescription("Usuario con permisos básicos");
        rolRepository.save(userRole);
    }
}
}