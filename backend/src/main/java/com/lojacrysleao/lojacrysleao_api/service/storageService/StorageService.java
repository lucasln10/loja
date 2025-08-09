package com.lojacrysleao.lojacrysleao_api.service.storageService;

import com.lojacrysleao.lojacrysleao_api.dto.storageDTO.StorageDTO;
import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import com.lojacrysleao.lojacrysleao_api.mapper.storageMapper.StorageMapper;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;
import com.lojacrysleao.lojacrysleao_api.repository.storageRepository.StorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StorageService {

    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private StorageMapper storageMapper;

    public Storage create(Product product) {
        if (product == null) {
            throw new BadRequestException("O Produto não pode ser nulo");
        }

        Storage storage = new Storage();
        storage.setProduct_id(product.getId());
        storage.setQuantity(product.getQuantity());
        storage.setReservation(0);

        return storageRepository.save(storage);
    }

    public StorageDTO findByProductId(Long productId) {
        if (productId == null) {
            throw new BadRequestException("Product ID não podem ser nulos");
        }

        Storage storage = storageRepository.findByProduct_Id(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Estoque não encontrado para o produto ID " + productId));

        return storageMapper.toDTO(storage);
    }

    public Storage update(Product product) {
        if (product == null || product.getId() == null) {
            throw new BadRequestException("Product e ID não podem ser nulos");
        }

        storageRepository.findById(product.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + product.getId() + " não encontrado"));

        Storage storage = new Storage();
        storage.setProduct_id(product.getId());
        storage.setQuantity(product.getQuantity());
        storage.setReservation(0);

        return storageRepository.save(storage);
    }

    public void delete(Long id) {
        findByProductId(id);
        storageRepository.deleteById(id);
    }


}