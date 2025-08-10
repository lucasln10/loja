package com.lojacrysleao.lojacrysleao_api.service.lojaService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import com.lojacrysleao.lojacrysleao_api.exception.ValidationException;
import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.ProductMapper;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.CategoryRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import com.lojacrysleao.lojacrysleao_api.service.storageService.StorageService;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private StorageService storageService;

    // storageRepository not used directly; StorageService encapsulates logic


    @Transactional
    public ProductDTO create(ProductDTO dto) {
        if (dto == null) {
            throw new BadRequestException("ProductDTO não pode ser nulo");
        }
        
        if (dto.getCategoryId() == null) {
            throw new BadRequestException("ID da categoria é obrigatório");
        }
        
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + dto.getCategoryId() + " não encontrada"));

        Product product = productMapper.toEntity(dto, category);
        // Primeiro salva o produto para garantir que tenha ID
        Product savedProduct = productRepository.save(product);
        // Agora cria o estoque vinculado ao produto salvo
        Storage storage = storageService.create(savedProduct);
        savedProduct.setStorage(storage);

        return productMapper.toDTO(savedProduct);
    }

    public List<ProductDTO> listAll() {
        return  productRepository.findAll()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> listEnabled() {
        return productRepository.findByStatus(true)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> listDisabled() {
        return productRepository.findByStatus(false)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO findById(Long id) {
        if (id == null) {
            throw new BadRequestException("ID não pode ser nulo");
        }
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado"));
        return productMapper.toDTO(product);
    }

    @Transactional
    public ProductDTO update(ProductDTO dto) {
        if (dto == null || dto.getId() == null) {
            throw new BadRequestException("ProductDTO e ID não podem ser nulos");
        }

        if (dto.getCategoryId() == null) {
            throw new BadRequestException("ID da categoria é obrigatório");
        }

        Product existing = productRepository.findById(dto.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + dto.getId() + " não encontrado"));

        Category category = categoryRepository.findById(dto.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + dto.getCategoryId() + " não encontrada"));

        // Atualiza apenas os campos mutáveis
        existing.setName(dto.getName());
        existing.setPrice(dto.getPrice());
        existing.setQuantity(dto.getQuantity());
        existing.setDescription(dto.getDescription());
        existing.setDetailedDescription(dto.getDetailedDescription());
        existing.setStatus(dto.isStatus());
        existing.setCategory(category);

        Product savedProduct = productRepository.save(existing);
        // Atualiza o estoque existente para refletir a nova quantidade
        storageService.update(savedProduct);

        return productMapper.toDTO(savedProduct);
    }

    public void delete(Long id) {
        // Verifica se produto existe
        findById(id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + id));

        if (product.isStatus()) {
            throw new ValidationException("PRODUTO ESTA ATIVO, POR ISTO NAO PODE SER EXCLUIDO.");
        }
        productRepository.deleteById(id);
    }

    public boolean enableStatus(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + id));

        if (product.isStatus()){
            throw new BadRequestException("Produto ja esta ativo.");
        }

        product.setStatus(true);
        productRepository.save(product);
        return true;
    }

    public boolean desableStatus(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + id));

        // Só é possível desativar se o produto estiver ativo
        if (!product.isStatus()) {
            throw new BadRequestException("Produto já está inativo.");
        }

        product.setStatus(false);
        productRepository.save(product);
        return false;
    }

    
}
