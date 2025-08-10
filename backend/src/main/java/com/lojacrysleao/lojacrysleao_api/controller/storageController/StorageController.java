package com.lojacrysleao.lojacrysleao_api.controller.storageController;

import com.lojacrysleao.lojacrysleao_api.dto.storageDTO.StorageDTO;
import com.lojacrysleao.lojacrysleao_api.service.storageService.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    @Autowired
    private StorageService storageService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<StorageDTO>> listAll() {
        return ResponseEntity.ok(storageService.listAll());
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StorageDTO> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(storageService.findByProductId(productId));
    }

    public static class UpdateStorageRequest {
        public Integer quantity;
        public Integer reservation;
        public Integer getQuantity() { return quantity; }
        public Integer getReservation() { return reservation; }
    }

    @PutMapping("/product/{productId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StorageDTO> updateByProduct(@PathVariable Long productId,
                                                      @RequestBody UpdateStorageRequest request) {
        Integer quantity = request != null ? request.getQuantity() : null;
        Integer reservation = request != null ? request.getReservation() : null;
        StorageDTO dto = storageService.updateByProductId(productId, quantity, reservation);
        return ResponseEntity.ok(dto);
    }
}
