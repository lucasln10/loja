package com.lojacrysleao.lojacrysleao_api.service.lojaService;

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
import com.lojacrysleao.lojacrysleao_api.repository.storageRepository.StorageRepository;
import com.lojacrysleao.lojacrysleao_api.service.storageService.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    @Autowired
    private StorageRepository storageRepository;


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
        Product savedProduct = productRepository.save(product);

        storageService.create(savedProduct);

        return productMapper.toDTO(savedProduct);
    }

    public List<ProductDTO> listAll() {
        return  productRepository.findAll()
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

    public ProductDTO update(ProductDTO dto) {
        if (dto == null || dto.getId() == null) {
            throw new BadRequestException("ProductDTO e ID não podem ser nulos");
        }

        if (dto.getCategoryId() == null) {
            throw new BadRequestException("ID da categoria é obrigatório");
        }

        productRepository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + dto.getId() + " não encontrado"));
        
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + dto.getCategoryId() + " não encontrada"));

        Product product = productMapper.toEntity(dto, category);
        Product savedProduct = productRepository.save(product);

        storageService.update(savedProduct);

        return productMapper.toDTO(savedProduct);
    }

    public void delete(Long id) {
        // Verifica se produto existe
        findById(id);
        Product product = new Product();

        if (product.isStatus()) {
            throw new ValidationException("PRODUTO ESTA ATIVO, POR ISTO NAO PODE SER EXCLUIDO.");
        }
        productRepository.deleteById(id);
    }

    public ProductDTO StatusOnOrOff()
    
}
