package com.lojacrysleao.lojacrysleao_api.mapper.storageMapper;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import com.lojacrysleao.lojacrysleao_api.dto.storageDTO.StorageDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.loja.ProductImage;
import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;


import java.util.List;
import java.util.stream.Collectors;

public class StorageMapper {

    public StorageDTO toDTO(Storage storage){
        if (storage == null) {
            return null;
        }

        StorageDTO dto = new StorageDTO();
        dto.setId(storage.getId());
        dto.setProduct(storage.getProduct_id());
        dto.setQuantity(storage.getQuantity());
        dto.setReservation(storage.getReservation());

        return dto;
    }

    public Storage toEntity(Product product) {
        if (storageDTO == null) {
            return null;
        }

        Storage storage = new Storage();
        storage.setProduct_id(product.getId);
        storage.setQuantity(product.getQuantity);
        storage.setReservation(0);

        return storage;
    }

}
