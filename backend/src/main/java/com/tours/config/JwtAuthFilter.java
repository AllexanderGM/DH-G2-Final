package com.tours.config;

import com.tours.domain.services.JwtService;
import com.tours.infrastructure.entities.user.Token;
import com.tours.infrastructure.entities.user.User;
import com.tours.infrastructure.repositories.user.ITokenRepository;
import com.tours.infrastructure.repositories.user.IUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

import org.springframework.http.HttpHeaders;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final ITokenRepository tokenRepository;
    private final IUserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain
            ) throws ServletException, IOException {

        logger.info(STR."\uD83D\uDCCC Nueva petición a: \{request.getServletPath()}");

        if (request.getServletPath().contains("/auth")) {
            logger.info("🔹 Ruta pública, omitiendo filtro.");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("❌ No se encontró un token válido en el Header.");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = authHeader.substring(7);
        logger.info(STR."\uD83D\uDD39 Token extraído: \{jwtToken}");

        final String userEmail = jwtService.extractUsername(jwtToken);
        logger.info(STR."\uD83D\uDD39 Usuario extraído del token: \{userEmail}");

        if (userEmail == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            logger.warn("❌ Usuario no encontrado o ya autenticado.");
            return;
        }

        final Token token = tokenRepository.findByToken(jwtToken).orElse(null);
        if (token == null) {
            logger.warn("❌ El token no está registrado en la base de datos.");
            filterChain.doFilter(request, response);
            return;
        }

        if (token.isExpired() || token.isRevoked()) {
            logger.warn("❌ El token está expirado o ha sido revocado.");
            filterChain.doFilter(request, response);
            return;
        }

        final UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
        final Optional<User> user = userRepository.findByEmail(userEmail);

        if (user.isEmpty()) {
            logger.warn("❌ El usuario no existe en la base de datos.");
            filterChain.doFilter(request, response);
            return;
        }

        final boolean isTokenValid = jwtService.isTokenValid(jwtToken, user.get());
        logger.info(STR."\uD83D\uDD39 ¿Token válido?: \{isTokenValid}");

        if (!isTokenValid) {
            logger.warn("❌ Token inválido.");
            return;
        }

        final var authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        logger.info(STR."✅ Usuario autenticado correctamente: \{userEmail}");

        filterChain.doFilter(request, response);
    }
}
