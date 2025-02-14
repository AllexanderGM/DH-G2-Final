package com.tours.tours.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedOriginPatterns("*") //enlace al front
                .allowedMethods("GET", "POST", "PUT","DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
