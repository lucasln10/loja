package com.lojacrysleao.lojacrysleao_api.service.lojaService;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.ProductMapper;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.CategoryRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
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


    public ProductDTO create(ProductDTO dto) {
        if (dto == null) {
            throw new RuntimeException("ProductDTO nao pode ser nulo.");
        }
        
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoria nao encontrada."));  

        Product product = productMapper.toEntity(dto, category);
        Product saved = productRepository.save(product);
        return productMapper.toDTO(saved);
    }

    public List<ProductDTO> listAll() {
        return  productRepository.findAll()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO findById(Long id) {
        if (id == null) {
            throw new RuntimeException("ID nao pode ser nulo.");
        }
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto nao encontrado."));
        return productMapper.toDTO(product);
    }

    public ProductDTO update(ProductDTO dto) {
        if (dto == null || dto.getId() == null) {
            throw new RuntimeException("ProductDTO ou ID nao podem ser nulos.");
        }

        productRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Produto nao encontrado."));
        
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoria nao encontrada."));

        Product product = productMapper.toEntity(dto, category);
        Product saved = productRepository.save(product);
        return productMapper.toDTO(saved);
    }

    public void delete(Long id) {
        // Verifica se produto existe
        findById(id);
        productRepository.deleteById(id);
    }
    
}
