package com.tours.tours.repository;

import com.tours.tours.entity.Paquete;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaqueteRepository extends JpaRepository<Paquete, Long> {
    Page<Paquete> findAll(Pageable pageable);
    boolean existsByNombre(String nombre);
}
