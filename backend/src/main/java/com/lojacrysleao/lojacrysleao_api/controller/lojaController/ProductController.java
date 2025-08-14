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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductSearchDTO;
import com.lojacrysleao.lojacrysleao_api.dto.common.PageResponseDTO;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductSearchStatsDTO;
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
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ProductDTO>> getEnabledProducts() {
        return ResponseEntity.ok(productService.listEnabled());
    }

    @GetMapping("/disabled")
    @PreAuthorize("hasAuthority('ADMIN')")
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

    /**
     * Busca avançada com filtros e paginação
     */
    @PostMapping("/search")
    public ResponseEntity<PageResponseDTO<ProductDTO>> searchProducts(@RequestBody ProductSearchDTO searchDTO) {
        PageResponseDTO<ProductDTO> result = productService.searchProducts(searchDTO);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Busca simples por termo
     */
    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<ProductDTO>> searchByTerm(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponseDTO<ProductDTO> result = productService.searchByTerm(q, page, size);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Filtra produtos por categoria
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<PageResponseDTO<ProductDTO>> filterByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponseDTO<ProductDTO> result = productService.filterByCategory(categoryId, page, size);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Filtra produtos por faixa de preço
     */
    @GetMapping("/price-range")
    public ResponseEntity<PageResponseDTO<ProductDTO>> filterByPriceRange(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponseDTO<ProductDTO> result = productService.filterByPriceRange(minPrice, maxPrice, page, size);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Filtra produtos por estoque
     */
    @GetMapping("/stock")
    public ResponseEntity<PageResponseDTO<ProductDTO>> filterByStock(
            @RequestParam Integer minStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponseDTO<ProductDTO> result = productService.filterByStock(minStock, page, size);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Lista produtos com paginação básica
     */
    @GetMapping("/page")
    public ResponseEntity<PageResponseDTO<ProductDTO>> getProductsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        ProductSearchDTO searchDTO = new ProductSearchDTO();
        searchDTO.setPage(page);
        searchDTO.setSize(size);
        searchDTO.setSortBy(sortBy);
        searchDTO.setSortDirection(sortDirection);
        searchDTO.setActiveOnly(true);
        
        PageResponseDTO<ProductDTO> result = productService.searchProducts(searchDTO);
        return ResponseEntity.ok(result);
    }

    /**
     * Obtém estatísticas dos produtos para filtros
     */
    @GetMapping("/stats")
    public ResponseEntity<ProductSearchStatsDTO> getProductStats() {
        ProductSearchStatsDTO stats = productService.getProductStats();
        return ResponseEntity.ok(stats);
    }
}
