package com.lojacrysleao.lojacrysleao_api.mapper.storageMapper;

import com.lojacrysleao.lojacrysleao_api.dto.storageDTO.StorageDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;
import org.springframework.stereotype.Component;

@Component
public class StorageMapper {

    public StorageDTO toDTO(Storage storage){
        if (storage == null) {
            return null;
        }

        StorageDTO dto = new StorageDTO();
        dto.setId(storage.getId());
        dto.setProduct_id(storage.getProduct() != null ? storage.getProduct().getId() : null);
        dto.setQuantity(storage.getQuantity());
        dto.setReservation(storage.getReservation());

        return dto;
    }

    public Storage toEntity(Product product) {
        if (product == null) {
            return null;
        }

        Storage storage = new Storage();
        storage.setProduct(product);
        storage.setQuantity(product.getQuantity());
        storage.setReservation(0);

        return storage;
    }

}
