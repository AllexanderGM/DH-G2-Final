package com.tours.tours.service;

import com.tours.tours.entity.Paquete;
import com.tours.tours.exception.NombreDuplicadoException;
import com.tours.tours.exception.RecursoNoEncontradoException;
import com.tours.tours.repository.PaqueteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PaqueteService {
    private final PaqueteRepository paqueteRepository;

    public PaqueteService(PaqueteRepository paqueteRepository) {
        this.paqueteRepository = paqueteRepository;
    }

    public List<Paquete> obtenerPaquetesAleatorios(int limite) {
        List<Paquete> paquetes = paqueteRepository.findAll();
        Collections.shuffle(paquetes);
        return paquetes.subList(0, Math.min(limite, paquetes.size()));
    }
    public Optional<Paquete> obtenerPaquete(Long id) throws RecursoNoEncontradoException{
        if (!paqueteRepository.existsById(id)){
            throw new RecursoNoEncontradoException("Paquete no encontrado");
        }
        return paqueteRepository.findById(id);
    }

    public Page<Paquete> listarPaquetesPaginados(Pageable pageable) {
        return paqueteRepository.findAll(pageable);
    }

    public Paquete agregarPaquete(Paquete paquete) throws NombreDuplicadoException {
        if (paqueteRepository.existsByNombre(paquete.getNombre())) {
            throw new NombreDuplicadoException("El nombre ya existe");
        }
        return paqueteRepository.save(paquete);
    }

    public Paquete actualizarPaquete(Long id, Paquete paquete) throws RecursoNoEncontradoException {
        if (!paqueteRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Paquete no encontrado");
        }
        paquete.setIdPaquete(id);
        return paqueteRepository.save(paquete);
    }

    public void eliminarPaquete(Long id) throws RecursoNoEncontradoException {
        if (!paqueteRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Paquete no encontrado");
        }
        paqueteRepository.deleteById(id);
    }
}
