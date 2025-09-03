package com.lojacrysleao.lojacrysleao_api.service.lojaService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductSearchDTO;
import com.lojacrysleao.lojacrysleao_api.dto.common.PageResponseDTO;
import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import com.lojacrysleao.lojacrysleao_api.exception.ValidationException;
import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.ProductMapper;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductSearchStatsDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.CategoryRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import com.lojacrysleao.lojacrysleao_api.service.storageService.StorageService;
import com.lojacrysleao.lojacrysleao_api.service.uploadService.ImageServiceImpl;

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
    private ImageServiceImpl imageService;
    
    // storageRepository not used directly; StorageService encapsulates logic


    @Transactional
    public ProductDTO create(ProductDTO dto) {
        if (dto == null) {
            throw new BadRequestException("ProductDTO não pode ser nulo");
        }
        
        Product product = productMapper.toEntity(dto);
        
        // Configurar categoria principal (para compatibilidade)
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + dto.getCategoryId() + " não encontrada"));
            product.setCategory(category);
        }
        
        // Configurar múltiplas categorias
        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            Set<Category> categories = dto.getCategoryIds().stream()
                    .map(id -> categoryRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + id + " não encontrada")))
                    .collect(Collectors.toSet());
            product.getCategories().addAll(categories);
        }
        
        // Por padrão, novos produtos ficam ativos para aparecerem na Home
        if (!product.isStatus()) {
            product.setStatus(true);
        }
        
        // Primeiro salva o produto para garantir que tenha ID
        Product savedProduct = productRepository.save(product);
        
        // Agora cria o estoque vinculado ao produto salvo
        Storage storage = storageService.create(savedProduct);
        savedProduct.setStorage(storage);

        return productMapper.toDTO(savedProduct);
    }

    public List<ProductDTO> listAll() {
        return productRepository.findAll()
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

        Product existing = productRepository.findById(dto.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + dto.getId() + " não encontrado"));

        // Atualizar campos básicos
        productMapper.updateEntityFromDTO(dto, existing);

        // Atualizar categoria principal (para compatibilidade)
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + dto.getCategoryId() + " não encontrada"));
            existing.setCategory(category);
        }

        // Atualizar múltiplas categorias
        if (dto.getCategoryIds() != null) {
            // Limpar categorias existentes
            existing.getCategories().clear();
            
            // Adicionar novas categorias
            if (!dto.getCategoryIds().isEmpty()) {
                Set<Category> categories = dto.getCategoryIds().stream()
                        .map(id -> categoryRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + id + " não encontrada")))
                        .collect(Collectors.toSet());
                existing.getCategories().addAll(categories);
            }
        }

        Product savedProduct = productRepository.save(existing);
        // Atualiza o estoque existente para refletir a nova quantidade
        storageService.update(savedProduct);

        return productMapper.toDTO(savedProduct);
    }

    @Transactional
    public void delete(Long id) {
        if (id == null) {
            throw new BadRequestException("ID não pode ser nulo");
        }
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + id));

        if (product.isStatus()) {
            throw new ValidationException("PRODUTO ESTA ATIVO, POR ISTO NAO PODE SER EXCLUIDO.");
        }
        
        // Deletar arquivos de imagem físicos se existirem
        if (product.getImages() != null) {
            product.getImages().forEach(img -> {
                try {
                    imageService.deleteImage(img.getFilename());
                } catch (Exception ignored) {
                    // Log do erro mas continua a operação
                }
            });
        }
        
        // Com cascade = CascadeType.ALL e orphanRemoval = true, 
        // todas as entidades relacionadas serão deletadas automaticamente
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

    /**
     * Busca produtos com filtros avançados e paginação
     */
    public PageResponseDTO<ProductDTO> searchProducts(ProductSearchDTO searchDTO) {
        // Validação dos parâmetros
        validateSearchParams(searchDTO);
        
        // Criação do Pageable com ordenação
        Pageable pageable = createPageable(searchDTO);
        
        // Aplicação dos filtros
        Page<Product> productPage = applyFilters(searchDTO, pageable);
        
        // Conversão para DTOs
        List<ProductDTO> productDTOs = productPage.getContent()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
        
        // Criação da resposta paginada
        return PageResponseDTO.of(
            productDTOs,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements()
        );
    }
    
    /**
     * Busca simples por termo de busca
     */
    public PageResponseDTO<ProductDTO> searchByTerm(String searchTerm, int page, int size) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new BadRequestException("Termo de busca não pode ser vazio");
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Product> productPage = productRepository.findBySearchTermAndStatus(searchTerm.trim(), true, pageable);
        
        List<ProductDTO> productDTOs = productPage.getContent()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
        
        return PageResponseDTO.of(
            productDTOs,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements()
        );
    }
    
    /**
     * Filtra produtos por categoria
     */
    public PageResponseDTO<ProductDTO> filterByCategory(Long categoryId, int page, int size) {
        if (categoryId == null) {
            throw new BadRequestException("ID da categoria não pode ser nulo");
        }
        
        // Verifica se a categoria existe
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + categoryId + " não encontrada"));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Product> productPage = productRepository.findByCategoryIdAndStatus(categoryId, true, pageable);
        
        List<ProductDTO> productDTOs = productPage.getContent()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
        
        return PageResponseDTO.of(
            productDTOs,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements()
        );
    }
    
    /**
     * Filtra produtos por múltiplas categorias
     */
    public PageResponseDTO<ProductDTO> filterByCategories(List<Long> categoryIds, int page, int size) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            throw new BadRequestException("Pelo menos um ID de categoria deve ser informado");
        }
        
        // Verifica se as categorias existem
        for (Long categoryId : categoryIds) {
            categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + categoryId + " não encontrada"));
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Product> productPage = productRepository.findByCategoriesIdInAndStatus(categoryIds, true, pageable);
        
        List<ProductDTO> productDTOs = productPage.getContent()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
        
        return PageResponseDTO.of(
            productDTOs,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements()
        );
    }
    
    /**
     * Filtra produtos por faixa de preço
     */
    public PageResponseDTO<ProductDTO> filterByPriceRange(Double minPrice, Double maxPrice, int page, int size) {
        if (minPrice == null && maxPrice == null) {
            throw new BadRequestException("Pelo menos um valor de preço deve ser informado");
        }
        
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new BadRequestException("Preço mínimo não pode ser maior que o preço máximo");
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("price").ascending());
        Page<Product> productPage = productRepository.findByPriceBetweenAndStatus(
            minPrice != null ? minPrice : 0.0,
            maxPrice != null ? maxPrice : Double.MAX_VALUE,
            true,
            pageable
        );
        
        List<ProductDTO> productDTOs = productPage.getContent()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
        
        return PageResponseDTO.of(
            productDTOs,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements()
        );
    }
    
    /**
     * Filtra produtos por estoque
     */
    public PageResponseDTO<ProductDTO> filterByStock(Integer minStock, int page, int size) {
        if (minStock == null || minStock < 0) {
            throw new BadRequestException("Estoque mínimo deve ser um valor positivo");
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("quantity").descending());
        Page<Product> productPage = productRepository.findByQuantityGreaterThanAndStatus(minStock, true, pageable);
        
        List<ProductDTO> productDTOs = productPage.getContent()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
        
        return PageResponseDTO.of(
            productDTOs,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements()
        );
    }

    /**
     * Valida os parâmetros de busca
     */
    private void validateSearchParams(ProductSearchDTO searchDTO) {
        if (searchDTO == null) {
            throw new BadRequestException("Parâmetros de busca não podem ser nulos");
        }
        
        if (searchDTO.getPage() != null && searchDTO.getPage() < 0) {
            throw new BadRequestException("Número da página deve ser maior ou igual a 0");
        }
        
        if (searchDTO.getSize() != null && (searchDTO.getSize() < 1 || searchDTO.getSize() > 100)) {
            throw new BadRequestException("Tamanho da página deve estar entre 1 e 100");
        }
        
        if (searchDTO.getMinPrice() != null && searchDTO.getMaxPrice() != null && 
            searchDTO.getMinPrice() > searchDTO.getMaxPrice()) {
            throw new BadRequestException("Preço mínimo não pode ser maior que o preço máximo");
        }
        
        if (searchDTO.getMinStock() != null && searchDTO.getMaxStock() != null && 
            searchDTO.getMinStock() > searchDTO.getMaxStock()) {
            throw new BadRequestException("Estoque mínimo não pode ser maior que o estoque máximo");
        }
    }
    
    /**
     * Cria o Pageable com ordenação
     */
    private Pageable createPageable(ProductSearchDTO searchDTO) {
        String sortBy = searchDTO.getSortBy() != null ? searchDTO.getSortBy() : "name";
        String sortDirection = searchDTO.getSortDirection() != null ? searchDTO.getSortDirection() : "asc";
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        
        int page = searchDTO.getPage() != null ? searchDTO.getPage() : 0;
        int size = searchDTO.getSize() != null ? searchDTO.getSize() : 20;
        
        return PageRequest.of(page, size, sort);
    }
    
    /**
     * Aplica os filtros baseado nos parâmetros de busca
     */
    private Page<Product> applyFilters(ProductSearchDTO searchDTO, Pageable pageable) {
        // Aplica filtro de estoque se especificado
        if (searchDTO.getInStock() != null && searchDTO.getInStock()) {
            searchDTO.setMinStock(1);
        }
        
        // Usa o método de busca avançada que suporta todos os filtros
        return productRepository.findByAdvancedFilters(
            searchDTO.getActiveOnly(),
            searchDTO.getCategoryId(),
            searchDTO.getMinPrice(),
            searchDTO.getMaxPrice(),
            searchDTO.getMinStock(),
            searchDTO.getMaxStock(),
            searchDTO.getSearchTerm(),
            pageable
        );
    }

    /**
     * Obtém estatísticas dos produtos para filtros
     */
    public ProductSearchStatsDTO getProductStats() {
        ProductSearchStatsDTO stats = new ProductSearchStatsDTO();
        
        // Estatísticas de preço
        stats.setMinPrice(productRepository.findMinPriceByStatus(true));
        stats.setMaxPrice(productRepository.findMaxPriceByStatus(true));
        
        // Estatísticas de estoque
        stats.setMinStock(productRepository.findMinStockByStatus(true));
        stats.setMaxStock(productRepository.findMaxStockByStatus(true));
        
        // Total de produtos ativos
        stats.setTotalProducts(productRepository.countByStatus(true));
        
        // Contagem por categoria
        List<Object[]> categoryCounts = productRepository.countByCategoryAndStatus(true);
        List<ProductSearchStatsDTO.CategoryCountDTO> categoryStats = categoryCounts.stream()
                .map(row -> new ProductSearchStatsDTO.CategoryCountDTO(
                    (Long) row[0],
                    (String) row[1],
                    (Long) row[2]
                ))
                .collect(Collectors.toList());
        stats.setCategories(categoryStats);
        
        return stats;
    }
}