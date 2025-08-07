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
        dto.setName(storage.getName());
        dto.setPrice(storage.getPrice());
        dto.setQuantity(storage.getQuantity());
        dto.setReservation(storage.getReservation());
        List<ProductDTO> productDTOs = storage.getProducts().stream()
        .map(this::toProductDTO)
        .toList();
        dto.setProducts(productDTOs);

        return dto;
    }

    private ProductDTO toProductDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setDescription(product.getDescription());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        
        // Mapear as URLs das imagens
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            List<String> imageUrls = product.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
            dto.setImageUrls(imageUrls);
            //primeira imagem como imageUrl principal
            dto.setImageUrl(product.getPrimaryImageUrl());
        }

        return dto;
    }

    public Storage toEntity(StorageDTO storageDTO) {
        if (storageDTO == null) {
            return null;
        }

        Storage storage = new Storage();
        storage.setId(storageDTO.getId());
        storage.setName(storageDTO.getName());
        storage.setPrice(storageDTO.getPrice());
        storage.setQuantity(storageDTO.getQuantity());
        storage.setReservation(storageDTO.getReservation());

        // Converte ProductDTO para Product
        if (storageDTO.getProducts() != null) {
            List<Product> products = storageDTO.getProducts().stream()
                .map(dto -> toProductEntity(dto, storage))
                .toList();
            storage.setProducts(products);
        }

        return storage;
    }

    private Product toProductEntity(ProductDTO dto, Storage storage) {
        if (dto == null) return null;


        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setDescription(dto.getDescription());
        product.setStorage(storage);
        return product;
    }
}
