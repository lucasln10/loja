package com.lojacrysleao.lojacrysleao_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import static com.lojacrysleao.lojacrysleao_api.service.uploadService.ImageServiceImpl.UPLOAD_DIR;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/products/**")
        .addResourceLocations("file:" + UPLOAD_DIR + "/");

    registry.addResourceHandler("/uploads/product/**")
        .addResourceLocations("file:uploads/product/");
        
        registry.addResourceHandler("/uploads/carousel/**")
                .addResourceLocations("file:uploads/carousel/");
    }
}
