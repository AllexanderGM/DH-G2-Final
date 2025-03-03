package com.tours.application.handlers;

import com.tours.domain.dto.response.FormatResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

@Data
@AllArgsConstructor
@Component
public class ResponseHandler {
    /**
     * Método para manejar las rutas y devolver la respuesta con el código de estado HTTP adecuado.
     *
     * @param message      Contexto o descripción del proceso.
     * @param encrypted    Indica si los datos están encriptados.
     * @param dataSupplier Proveedor de datos.
     */

    public static <T> FormatResponseDTO format(String message, Boolean encrypted, Supplier<T> dataSupplier) {
        try {
            T data = dataSupplier.get();
            return new FormatResponseDTO(
                    "Proceso exitoso: " + message,
                    true,
                    encrypted,
                    data);
        } catch (Exception e) {
            return new FormatResponseDTO(
                    "Falló el proceso: " + e.getMessage(),
                    false,
                    encrypted,
                    null);
        }
    }

    // Sobrecarga del método format para manejar acciones que no devuelven datos.
    public static FormatResponseDTO format(String message, Boolean encrypted, Runnable action) {
        try {
            action.run();
            return new FormatResponseDTO(
                    "Proceso exitoso: " + message,
                    true,
                    encrypted,
                    null
            );
        } catch (Exception e) {
            return new FormatResponseDTO(
                    "Falló el proceso: " + e.getMessage(),
                    false,
                    encrypted,
                    null
            );
        }
    }

}
