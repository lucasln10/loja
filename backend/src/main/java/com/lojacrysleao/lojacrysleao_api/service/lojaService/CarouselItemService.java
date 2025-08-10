package com.lojacrysleao.lojacrysleao_api.service.lojaService;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CarouselItemDTO;
import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.CarouselItemMapper;
import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselItem;
import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselType;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.CarouselItemRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CarouselItemService {
    
    @Autowired
    private CarouselItemRepository carouselItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CarouselItemMapper carouselItemMapper;
    
    public List<CarouselItemDTO> getActiveCarouselItems() {
        return carouselItemRepository.findActiveCarouselItems()
                .stream()
                .map(carouselItemMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<CarouselItemDTO> getAllCarouselItems() {
        return carouselItemRepository.findAll()
                .stream()
                .map(carouselItemMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<CarouselItemDTO> getCarouselItemsByType(CarouselType type) {
        return carouselItemRepository.findByCarouselTypeAndActiveOrderByDisplayOrderAsc(type, true)
                .stream()
                .map(carouselItemMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<CarouselItemDTO> getCarouselItemById(Long id) {
        return carouselItemRepository.findById(id)
                .map(carouselItemMapper::toDTO);
    }
    
    public CarouselItemDTO createCarouselItem(CarouselItemDTO carouselItemDTO) {
        CarouselItem carouselItem = carouselItemMapper.toEntity(carouselItemDTO);
        
        // Definir ordem de exibição se não especificada
        if (carouselItem.getDisplayOrder() == null || carouselItem.getDisplayOrder() == 0) {
            Integer maxOrder = carouselItemRepository.findMaxDisplayOrder();
            carouselItem.setDisplayOrder(maxOrder != null ? maxOrder + 1 : 1);
        }
        
        // Associar produto se necessário
        if (carouselItemDTO.getProductId() != null) {
            Optional<Product> product = productRepository.findById(carouselItemDTO.getProductId());
            if (product.isPresent()) {
                carouselItem.setProduct(product.get());
                // Se for tipo PRODUCT e não tem imageUrl definida, usar a imagem do produto
                if (carouselItem.getCarouselType() == CarouselType.PRODUCT && 
                    (carouselItem.getImageUrl() == null || carouselItem.getImageUrl().isEmpty())) {
                    carouselItem.setImageUrl(product.get().getPrimaryImageUrl());
                }
            }
        }
        
        CarouselItem savedItem = carouselItemRepository.save(carouselItem);
        return carouselItemMapper.toDTO(savedItem);
    }
    
    public CarouselItemDTO updateCarouselItem(Long id, CarouselItemDTO carouselItemDTO) {
        Optional<CarouselItem> existingItem = carouselItemRepository.findById(id);
        
        if (existingItem.isPresent()) {
            CarouselItem carouselItem = existingItem.get();
            
            carouselItem.setTitle(carouselItemDTO.getTitle());
            carouselItem.setDescription(carouselItemDTO.getDescription());
            carouselItem.setImageUrl(carouselItemDTO.getImageUrl());
            carouselItem.setCarouselType(carouselItemDTO.getCarouselType());
            carouselItem.setActive(carouselItemDTO.getActive());
            carouselItem.setDisplayOrder(carouselItemDTO.getDisplayOrder());
            carouselItem.setLinkUrl(carouselItemDTO.getLinkUrl());
            
            // Associar produto se necessário
            if (carouselItemDTO.getProductId() != null) {
                Optional<Product> product = productRepository.findById(carouselItemDTO.getProductId());
                if (product.isPresent()) {
                    carouselItem.setProduct(product.get());
                }
            } else {
                carouselItem.setProduct(null);
            }
            
            CarouselItem updatedItem = carouselItemRepository.save(carouselItem);
            return carouselItemMapper.toDTO(updatedItem);
        }
        
        return null;
    }
    
    public boolean deleteCarouselItem(Long id) {
        if (carouselItemRepository.existsById(id)) {
            carouselItemRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public CarouselItemDTO toggleCarouselItemStatus(Long id) {
        Optional<CarouselItem> existingItem = carouselItemRepository.findById(id);
        
        if (existingItem.isPresent()) {
            CarouselItem carouselItem = existingItem.get();
            carouselItem.setActive(!carouselItem.getActive());
            
            CarouselItem updatedItem = carouselItemRepository.save(carouselItem);
            return carouselItemMapper.toDTO(updatedItem);
        }
        
        return null;
    }
    
    public List<CarouselItemDTO> reorderCarouselItems(List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            Optional<CarouselItem> item = carouselItemRepository.findById(id);
            if (item.isPresent()) {
                item.get().setDisplayOrder(i + 1);
                carouselItemRepository.save(item.get());
            }
        }
        
        return getAllCarouselItems();
    }
    
    // Métodos específicos para o frontend
    public CarouselItemDTO addProductToCarousel(Long productId, int displayOrder) {
        System.out.println("CarouselItemService.addProductToCarousel - Iniciando com productId: " + productId);
        
        Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty()) {
            System.err.println("Produto não encontrado: " + productId);
            throw new RuntimeException("Produto não encontrado");
        }
        
        Product prod = product.get();
        System.out.println("Produto encontrado: " + prod.getName());
        
        CarouselItem carouselItem = new CarouselItem();
        carouselItem.setTitle(prod.getName());
        carouselItem.setDescription(prod.getDescription());
        
        // Corrigir URL da imagem do produto
        String productImageUrl = prod.getPrimaryImageUrl();
        if (productImageUrl != null && !productImageUrl.startsWith("http")) {
            // Se a URL não é absoluta, garantir que está no formato correto
            if (productImageUrl.startsWith("/api/products/images/")) {
                // Converter de /api/products/images/ para /uploads/products/
                productImageUrl = productImageUrl.replace("/api/products/images/", "/uploads/products/");
            } else if (!productImageUrl.startsWith("/uploads/")) {
                // Se não tem o prefixo correto, adicionar
                productImageUrl = "/uploads/products/" + productImageUrl;
            }
        }
        carouselItem.setImageUrl(productImageUrl);
        carouselItem.setCarouselType(CarouselType.PRODUCT);
        carouselItem.setProduct(prod);
        carouselItem.setActive(true);
        carouselItem.setDisplayOrder(displayOrder);
        
        System.out.println("Salvando item do carrossel...");
        CarouselItem savedItem = carouselItemRepository.save(carouselItem);
        System.out.println("Item salvo com ID: " + savedItem.getId());
        
        CarouselItemDTO dto = carouselItemMapper.toDTO(savedItem);
        System.out.println("DTO criado: " + dto.getTitle());
        
        return dto;
    }
    
    public CarouselItemDTO addCustomToCarousel(MultipartFile image, String title, String description, String linkUrl, int displayOrder) {
        try {
            // Salvar a imagem
            String imageUrl = saveCarouselImage(image);
            
            CarouselItem carouselItem = new CarouselItem();
            carouselItem.setTitle(title);
            carouselItem.setDescription(description);
            carouselItem.setImageUrl(imageUrl);
            carouselItem.setCarouselType(CarouselType.CUSTOM);
            carouselItem.setLinkUrl(linkUrl);
            carouselItem.setActive(true);
            carouselItem.setDisplayOrder(displayOrder);
            
            CarouselItem savedItem = carouselItemRepository.save(carouselItem);
            return carouselItemMapper.toDTO(savedItem);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao adicionar imagem personalizada: " + e.getMessage());
        }
    }
    
    private String saveCarouselImage(MultipartFile image) throws IOException {
        // Validar se o arquivo não está vazio
        if (image.isEmpty()) {
            throw new RuntimeException("Arquivo de imagem está vazio");
        }
        
        // Criar diretório se não existir
        String uploadDir = "uploads/carousel/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Gerar nome único para o arquivo
        String originalFileName = image.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            throw new RuntimeException("Nome do arquivo inválido");
        }
        
        String fileExtension = "";
        if (originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        } else {
            fileExtension = ".jpg"; // extensão padrão
        }
        
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Salvar arquivo
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Retornar URL relativa
        return "/" + uploadDir + uniqueFileName;
    }
}
