package com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper;

import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.loja.ProductImage;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setDescription(product.getDescription());
        dto.setDetailedDescription(product.getDetailedDescription());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        dto.setStatus(product.isStatus());

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

    public Product toEntity(ProductDTO dto) {
        if (dto == null) {
            return null;
        }

        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setDescription(dto.getDescription());
        product.setDetailedDescription(dto.getDetailedDescription());
        product.setStatus(dto.isStatus());

        // Processar imagens se fornecidas
        if (dto.getImageUrl() != null && !dto.getImageUrl().trim().isEmpty()) {
            ProductImage primaryImage = new ProductImage();
            primaryImage.setImageUrl(dto.getImageUrl());
            primaryImage.setFilename(extractFilenameFromUrl(dto.getImageUrl()));
            primaryImage.setPrimary(true);
            primaryImage.setDisplayOrder(1);
            primaryImage.setProduct(product);
            product.getImages().add(primaryImage);
        }

        // Processar imageUrls se fornecidas (além da imageUrl principal)
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            boolean hasPrimary = dto.getImageUrl() != null && !dto.getImageUrl().trim().isEmpty();
            
            for (int i = 0; i < dto.getImageUrls().size(); i++) {
                String imageUrl = dto.getImageUrls().get(i);
                if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                    // Evita duplicar a imageUrl principal
                    if (hasPrimary && imageUrl.equals(dto.getImageUrl())) {
                        continue;
                    }
                    
                    ProductImage image = new ProductImage();
                    image.setImageUrl(imageUrl);
                    image.setFilename(extractFilenameFromUrl(imageUrl));
                    image.setPrimary(!hasPrimary && i == 0); // Primeira imagem é principal se não há imageUrl
                    image.setDisplayOrder(hasPrimary ? i + 2 : i + 1); // Se tem primary, começa do 2
                    image.setProduct(product);
                    product.getImages().add(image);
                }
            }
        }

        return product;
    }

    public Product toEntity(ProductDTO dto, List<Category> setCategorys) {
        Product product = toEntity(dto);
        product.setCategorys(category);
        return product;
    }

    /**
     * Extrai o nome do arquivo da URL
     * Ex: "/uploads/products/produto-teste.jpg" -> "produto-teste.jpg"
     */
    private String extractFilenameFromUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return "default-image.jpg";
        }
        
        // Remove parâmetros da URL se houver
        String cleanUrl = url.split("\\?")[0];
        
        // Extrai o filename do path
        String filename = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
        
        // Se não conseguir extrair, usa um nome padrão
        if (filename.isEmpty() || !filename.contains(".")) {
            return "image-" + System.currentTimeMillis() + ".jpg";
        }
        
        return filename;
    }
}
