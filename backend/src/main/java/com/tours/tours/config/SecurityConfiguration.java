package com.tours.tours.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(
                auth ->{
                    // endpoints que no necesitan autenticacion
                    auth.requestMatchers("/api/auth/**").permitAll();

                    // endpoints de swagger
                    auth.requestMatchers(HttpMethod.GET, "/swagger-ui/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/v3/api-docs/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/swagger-ui.html").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/paquetes/*").permitAll();

                    auth.requestMatchers(HttpMethod.POST,"/paquetes/**").hasAnyAuthority("ADMIN");
                    auth.requestMatchers(HttpMethod.PUT,"/paquetes/**").hasAnyAuthority("ADMIN");
                    auth.requestMatchers(HttpMethod.DELETE,"/paquetes/**").hasAnyAuthority("ADMIN");
                    auth.requestMatchers(HttpMethod.GET,"/usuarios/**").hasAnyAuthority("ROLE_ADMIN");

                })
                .csrf(config -> config.disable())
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(authenticationProvider)
                .build();
    }
}
