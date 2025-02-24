package com.tours.tours.repository;


import com.tours.tours.entity.Rol;
import com.tours.tours.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByIdRol(Long id);

}
