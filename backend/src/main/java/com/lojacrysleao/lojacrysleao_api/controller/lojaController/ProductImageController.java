package com.lojacrysleao.lojacrysleao_api.controller.lojaController;

import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.loja.ProductImage;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductImageRepository;
import com.lojacrysleao.lojacrysleao_api.service.uploadService.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.lojacrysleao.lojacrysleao_api.service.uploadService.ImageServiceImpl.UPLOAD_DIR;

@RestController
@RequestMapping("/api/products/images")
public class ProductImageController {

    @Autowired
    private ImageService imageService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String filename = imageService.uploadImage(file);
        String imageUrl = "/api/products/images/" + filename;
        return ResponseEntity.ok(imageUrl);
    }

    @PostMapping("/upload-multiple/{productId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<String>> uploadMultipleImages(
            @PathVariable Long productId,
            @RequestParam("files") MultipartFile[] files) {
        
        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Product product = productOpt.get();
        List<String> imageUrls = new ArrayList<>();

        try {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                String filename = imageService.uploadImage(file);
                String imageUrl = "/api/products/images/" + filename;

                // Criar a entidade ProductImage
                ProductImage productImage = new ProductImage(imageUrl, filename, product);
                productImage.setDisplayOrder(i);
                
                // Se é a primeira imagem, marca como principal
                if (i == 0 && productImageRepository.findPrimaryImageByProductId(productId) == null) {
                    productImage.setPrimary(true);
                }

                productImageRepository.save(productImage);
                imageUrls.add(imageUrl);
            }

            return ResponseEntity.ok(imageUrls);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<String>> getProductImages(@PathVariable Long productId) {
        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrder(productId);
        List<String> imageUrls = images.stream()
                .map(ProductImage::getImageUrl)
                .toList();
        return ResponseEntity.ok(imageUrls);
    }

    @DeleteMapping("/{imageId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        Optional<ProductImage> imageOpt = productImageRepository.findById(imageId);
        if (!imageOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        ProductImage image = imageOpt.get();
        
        // Remover arquivo físico
        try {
            Path path = Paths.get(UPLOAD_DIR + File.separator + image.getFilename());
            Files.deleteIfExists(path);
        } catch (Exception e) {
            // Log do erro mas continua a operação
        }

        productImageRepository.delete(image);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path path = Paths.get(UPLOAD_DIR + File.separator + filename);
            UrlResource resource = new UrlResource(path.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

