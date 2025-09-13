package com.lojacrysleao.lojacrysleao_api.service.lojaService;


import java.util.List;
import java.util.stream.Collectors;

import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ConflictException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.CategoryMapper;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CategoryDTO;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.CategoryRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ProductRepository productRepository;

    public CategoryDTO create(CategoryDTO dto) {
        if (dto == null) {
            throw new BadRequestException("CategoryDTO não pode ser nulo");
        }
        
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new BadRequestException("Nome da categoria é obrigatório");
        }
        
        Category category = categoryMapper.toEntity(dto);
        
        // Se for uma subcategoria, verificar se a categoria pai existe
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria pai com ID " + dto.getParentId() + " não encontrada"));
            category.setParent(parent);
        }
        
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDTO(saved);
    }

    public List<CategoryDTO> listAll() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    // Listar apenas categorias raiz (sem pai)
    public List<CategoryDTO> listRootCategories() {
        return categoryRepository.findByParentIdIsNull()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    // Listar subcategorias de uma categoria específica
    public List<CategoryDTO> listSubcategories(Long parentId) {
        return categoryRepository.findByParentId(parentId)
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    // Listar categorias visíveis no header ordenadas
    public List<CategoryDTO> listHeaderCategories() {
        return categoryRepository.findByShowInHeaderAndStatusOrderByHeaderOrder(true, true)
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO findById(Long id) {
        if (id == null) {
            throw new BadRequestException("ID não pode ser nulo");
        }
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + id + " não encontrada"));
        return categoryMapper.toDTO(category);
    }

    public CategoryDTO update(CategoryDTO dto) {
        if (dto == null || dto.getId() == null) {
            throw new BadRequestException("CategoryDTO e ID não podem ser nulos");
        }
        
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new BadRequestException("Nome da categoria é obrigatório");
        }

        Category existing = categoryRepository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + dto.getId() + " não encontrada"));

        // Atualizar campos básicos
        categoryMapper.updateEntityFromDTO(dto, existing);
        
        // Se for uma subcategoria, verificar se a categoria pai existe
        if (dto.getParentId() != null && !dto.getParentId().equals(existing.getId())) {
            // Não permitir que uma categoria seja pai de si mesma
            if (dto.getParentId().equals(dto.getId())) {
                throw new BadRequestException("Uma categoria não pode ser pai de si mesma");
            }
            
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria pai com ID " + dto.getParentId() + " não encontrada"));
            existing.setParent(parent);
        } else if (dto.getParentId() == null) {
            // Remover o relacionamento com a categoria pai se parentId for null
            existing.setParent(null);
        }

        Category saved = categoryRepository.save(existing);
        return categoryMapper.toDTO(saved);
    }

    public void delete(Long id) {
        if (id == null) {
            throw new BadRequestException("ID não pode ser nulo");
        }
        
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + id + " não encontrada"));

        // Verificar se tem subcategorias
        List<Category> subcategories = categoryRepository.findByParentId(id);
        if (!subcategories.isEmpty()) {
            throw new ConflictException("Não é possível deletar categoria com subcategorias. Primeiro remova as subcategorias.");
        }
        
        // Verifica produtos vinculados a esta categoria
        boolean hasProducts = productRepository.findAll()
                .stream()
                .anyMatch(product -> product.getCategory() != null && 
                         product.getCategory().getId().equals(id));
        
        if (hasProducts) {
            throw new ConflictException("Não é possível deletar categoria com produtos vinculados");
        }
        
        categoryRepository.deleteById(id);
    }

    public boolean enableStatus(Long id){
        Category categoria = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + id + " não encontrada"));

        if (categoria.getStatus() == true){
            throw new BadRequestException("Categoria já está ativa.");
        }

        categoria.setStatus(true);
        categoryRepository.saveAndFlush(categoria);
        return categoria.getStatus();
    }

    public boolean desableStatus(Long id){
        Category categoria = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + id + " não encontrada"));

        if (categoria.getStatus() == false) {
            throw new BadRequestException("Categoria já está desativada.");
        }
        categoria.setStatus(false);
        categoryRepository.saveAndFlush(categoria);
        return false; // Return false when category is disabled
    }
    
    // Novo método para atualizar a ordem das categorias no header
    public void updateHeaderOrder(List<Long> categoryIds) {
        // Para cada ID na lista, atualizar o headerOrder com a posição na lista
        for (int i = 0; i < categoryIds.size(); i++) {
            Long categoryId = categoryIds.get(i);
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + categoryId + " não encontrada"));
            
            // Atualizar apenas se a categoria estiver configurada para aparecer no header
            if (category.isShowInHeader()) {
                category.setHeaderOrder(i);
                categoryRepository.save(category);
            }
        }
    }
}