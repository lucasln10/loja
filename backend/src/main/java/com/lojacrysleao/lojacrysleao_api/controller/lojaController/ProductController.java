package com.lojacrysleao.lojacrysleao_api.controller.lojaController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import com.lojacrysleao.lojacrysleao_api.service.lojaService.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.listAll();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/enabled")
    public ResponseEntity<List<ProductDTO>> getEnabledProducts() {
        return ResponseEntity.ok(productService.listEnabled());
    }

    @GetMapping("/disabled")
    public ResponseEntity<List<ProductDTO>> getDisabledProducts() {
        return ResponseEntity.ok(productService.listDisabled());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.create(productDTO);
        
        return ResponseEntity.ok(createdProduct);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        productDTO.setId(id);
        ProductDTO updatedProduct = productService.update(productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok("Produto excluído com sucesso");
    }

    @PutMapping("/{id}/enable")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Boolean> enableStatus(@PathVariable Long id) {
        return ResponseEntity.ok(productService.enableStatus(id));
    }

    @PutMapping("/{id}/disable")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Boolean> desableStatus(@PathVariable Long id) {
        return ResponseEntity.ok(productService.desableStatus(id));
    }
}
