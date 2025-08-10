package com.lojacrysleao.lojacrysleao_api.controller.lojaController;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CarouselItemDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselType;
import com.lojacrysleao.lojacrysleao_api.service.lojaService.CarouselItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/carousel")
@CrossOrigin(origins = "*")
public class CarouselController {
    
    @Autowired
    private CarouselItemService carouselItemService;
    
    // Endpoint público para obter itens ativos do carousel
    @GetMapping("/active")
    public ResponseEntity<List<CarouselItemDTO>> getActiveCarouselItems() {
        try {
            List<CarouselItemDTO> items = carouselItemService.getActiveCarouselItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Endpoint público para obter itens por tipo
    @GetMapping("/active/{type}")
    public ResponseEntity<List<CarouselItemDTO>> getCarouselItemsByType(@PathVariable CarouselType type) {
        try {
            List<CarouselItemDTO> items = carouselItemService.getCarouselItemsByType(type);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Endpoints administrativos
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CarouselItemDTO>> getAllCarouselItems() {
        try {
            List<CarouselItemDTO> items = carouselItemService.getAllCarouselItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarouselItemDTO> getCarouselItemById(@PathVariable Long id) {
        try {
            Optional<CarouselItemDTO> item = carouselItemService.getCarouselItemById(id);
            return item.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarouselItemDTO> createCarouselItem(@RequestBody CarouselItemDTO carouselItemDTO) {
        try {
            CarouselItemDTO createdItem = carouselItemService.createCarouselItem(carouselItemDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarouselItemDTO> updateCarouselItem(@PathVariable Long id, @RequestBody CarouselItemDTO carouselItemDTO) {
        try {
            CarouselItemDTO updatedItem = carouselItemService.updateCarouselItem(id, carouselItemDTO);
            if (updatedItem != null) {
                return ResponseEntity.ok(updatedItem);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCarouselItem(@PathVariable Long id) {
        try {
            boolean deleted = carouselItemService.deleteCarouselItem(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PatchMapping("/admin/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarouselItemDTO> toggleCarouselItemStatus(@PathVariable Long id) {
        try {
            CarouselItemDTO updatedItem = carouselItemService.toggleCarouselItemStatus(id);
            if (updatedItem != null) {
                return ResponseEntity.ok(updatedItem);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/admin/reorder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CarouselItemDTO>> reorderCarouselItems(@RequestBody List<Long> orderedIds) {
        try {
            List<CarouselItemDTO> reorderedItems = carouselItemService.reorderCarouselItems(orderedIds);
            return ResponseEntity.ok(reorderedItems);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Endpoints específicos para frontend
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CarouselItemDTO>> getAllCarouselItemsAdmin() {
        return getAllCarouselItems();
    }
    
    @PostMapping("/add-product/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarouselItemDTO> addProductToCarousel(
            @PathVariable Long productId, 
            @RequestParam(defaultValue = "1") int displayOrder) {
        try {
            System.out.println("Tentando adicionar produto " + productId + " ao carrossel com ordem " + displayOrder);
            CarouselItemDTO item = carouselItemService.addProductToCarousel(productId, displayOrder);
            System.out.println("Produto adicionado com sucesso: " + item.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (Exception e) {
            System.err.println("Erro ao adicionar produto ao carrossel: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/add-custom")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarouselItemDTO> addCustomToCarousel(
            @RequestParam("image") MultipartFile image,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "linkUrl", required = false) String linkUrl,
            @RequestParam(defaultValue = "1") int displayOrder) {
        try {
            CarouselItemDTO item = carouselItemService.addCustomToCarousel(image, title, description, linkUrl, displayOrder);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeCarouselItem(@PathVariable Long id) {
        return deleteCarouselItem(id);
    }
    
    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarouselItemDTO> toggleCarouselItem(@PathVariable Long id) {
        return toggleCarouselItemStatus(id);
    }
}
