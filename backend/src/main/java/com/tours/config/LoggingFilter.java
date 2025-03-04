package com.tours.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class LoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String url = request.getRequestURI();
        String origin = request.getHeader("Origin");
        String referer = request.getHeader("Referer");
        String clientIp = request.getRemoteAddr();

        log.info("\n****************************" +
                "\n NUEVA SOLICITUD RECIBIDA" +
                "\n🔹 Método: {}" +
                "\n🔹 URL: {}" +
                "\n🔹 Origin: {}" +
                "\n🔹 Referer: {}" +
                "\n🔹 IP: {}" +
                "\n****************************", method, url, origin, referer, clientIp);

        filterChain.doFilter(request, response);
    }
}
