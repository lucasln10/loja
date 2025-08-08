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

    public Storage toEntity(StorageDTO storageDTO) {
        if (storageDTO == null) {
            return null;
        }

        Storage storage = new Storage();
        storage.setId(storageDTO.getId());
        storage.setQuantity(storageDTO.getQuantity());
        storage.setReservation(storageDTO.getReservation());
        storage.setProduct_id(storage.getProduct());

        return storage;
    }

}
