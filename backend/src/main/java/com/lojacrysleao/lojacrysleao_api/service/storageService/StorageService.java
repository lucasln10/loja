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

        Storage storage = storageMapper.toEntity(product);
        storage.setProduct(product);
        storage.setQuantity(product.getQuantity());
        storage.setReservation(0);
    storage = storageRepository.save(storage);
    return storage;
    }

    public StorageDTO findByProductId(Long productId) {
        if (productId == null) {
            throw new BadRequestException("Product ID não podem ser nulos");
        }

        Storage storage = storageRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Estoque não encontrado para o produto ID " + productId));

        return storageMapper.toDTO(storage);
    }

    public Storage update(Product product) {
        if (product == null || product.getId() == null) {
            throw new BadRequestException("Product e ID não podem ser nulos");
        }

        // Busca o estoque pelo ID do produto
        Optional<Storage> existingOpt = storageRepository.findByProductId(product.getId());

        Storage storage;
        if (existingOpt.isPresent()) {
            storage = existingOpt.get();
            storage.setQuantity(product.getQuantity());
            // Mantém a reserva atual (ou ajuste conforme sua regra)
        } else {
            // Caso não exista, cria um novo
            storage = storageMapper.toEntity(product);
        }

    storage.setProduct(product);
    storage = storageRepository.save(storage);
    return storage;
    }

    public void delete(Long id) {
        findByProductId(id);
        storageRepository.deleteById(id);
    }

    //public int quantityProduct(Long id){

    //}

}