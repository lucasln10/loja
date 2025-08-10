package com.lojacrysleao.lojacrysleao_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Configurar para servir uploads de produtos
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:uploads/products/");
        
        // Configurar para servir uploads do carrossel
        registry.addResourceHandler("/uploads/carousel/**")
                .addResourceLocations("file:uploads/carousel/");
    }
}
