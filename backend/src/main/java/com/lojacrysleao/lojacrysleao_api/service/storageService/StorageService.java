package com.lojacrysleao.lojacrysleao_api.service.storageService;

import com.lojacrysleao.lojacrysleao_api.dto.storageDTO.StorageDTO;
import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import com.lojacrysleao.lojacrysleao_api.exception.ValidationException;
import com.lojacrysleao.lojacrysleao_api.mapper.storageMapper.StorageMapper;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;
import com.lojacrysleao.lojacrysleao_api.repository.storageRepository.StorageRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StorageService {

    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private StorageMapper storageMapper;

    @Autowired
    private ProductRepository productRepository;

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

    public List<StorageDTO> listAll() {
        return storageRepository.findAll()
                .stream()
                .map(storageMapper::toDTO)
                .collect(Collectors.toList());
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

    public StorageDTO updateByProductId(Long productId, Integer quantity, Integer reservation) {
        if (productId == null) {
            throw new BadRequestException("Product ID não pode ser nulo");
        }

        Storage storage = storageRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Estoque não encontrado para o produto ID " + productId));

        boolean changed = false;
        if (quantity != null) {
            storage.setQuantity(quantity);
            // manter Product.quantity em sincronia
            Product product = storage.getProduct();
            if (product != null) {
                product.setQuantity(quantity);
                productRepository.save(product);
            }
            changed = true;
        }
        if (reservation != null) {
            if (reservation < 0) {
                throw new ValidationException("Reserva não pode ser negativa");
            }
            storage.setReservation(reservation);
            changed = true;
        }

        if (!changed) {
            throw new BadRequestException("Nenhum campo para atualização informado");
        }

        storage = storageRepository.save(storage);
        return storageMapper.toDTO(storage);
    }

    public void delete(Long id) {
        findByProductId(id);
        storageRepository.deleteById(id);
    }

}