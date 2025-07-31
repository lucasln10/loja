package com.lojacrysleao.lojacrysleao_api.service.uploadService;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    String uploadImage(MultipartFile file) throws Exception;
}