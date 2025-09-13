package com.lojacrysleao.lojacrysleao_api.controller.lojaController;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CategoryDTO;
import com.lojacrysleao.lojacrysleao_api.service.lojaService.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Listar todas as categorias
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> listAll() {
        return ResponseEntity.ok(categoryService.listAll());
    }

    // Listar apenas categorias raiz (sem pai)
    @GetMapping("/root")
    public ResponseEntity<List<CategoryDTO>> listRootCategories() {
        return ResponseEntity.ok(categoryService.listRootCategories());
    }

    // Listar subcategorias de uma categoria específica
    @GetMapping("/{id}/subcategories")
    public ResponseEntity<List<CategoryDTO>> listSubcategories(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.listSubcategories(id));
    }

    // Listar categorias visíveis no header
    @GetMapping("/header")
    public ResponseEntity<List<CategoryDTO>> listHeaderCategories() {
        return ResponseEntity.ok(categoryService.listHeaderCategories());
    }

    // Obter uma categoria específica
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    // Criar uma nova categoria
    @PostMapping
    public ResponseEntity<CategoryDTO> create(@RequestBody CategoryDTO categoryDTO) {
        return ResponseEntity.ok(categoryService.create(categoryDTO));
    }

    // Atualizar uma categoria existente
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> update(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        categoryDTO.setId(id);
        return ResponseEntity.ok(categoryService.update(categoryDTO));
    }

    // Deletar uma categoria
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Ativar uma categoria
    @PutMapping("/{id}/enable")
    public ResponseEntity<Boolean> enable(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.enableStatus(id));
    }

    // Desativar uma categoria
    @PutMapping("/{id}/disable")
    public ResponseEntity<Boolean> disable(@PathVariable Long id) {
        return ResponseEntity.ok(!categoryService.desableStatus(id));
    }

    // Endpoint para atualizar a ordem das categorias no header
    @PutMapping("/header-order")
    public ResponseEntity<?> updateHeaderOrder(@RequestBody List<Long> categoryIds, 
                                               @RequestHeader("Authorization") String authHeader) {
        try {
            // Extrair token (remover "Bearer " prefixo)
            String token = authHeader.substring(7);
            
            // Atualizar a ordem das categorias
            categoryService.updateHeaderOrder(categoryIds);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
}