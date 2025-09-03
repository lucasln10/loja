package com.lojacrysleao.lojacrysleao_api.repository.lojaRepository;

import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	
	List<Product> findByStatus(boolean status);
	
	// Busca por texto (nome e descrição)
	@Query("SELECT p FROM Product p WHERE p.status = :status AND " +
		   "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
		   "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
		   "LOWER(p.detailedDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
	Page<Product> findBySearchTermAndStatus(@Param("searchTerm") String searchTerm, 
										  @Param("status") boolean status, 
										  Pageable pageable);
	
	// Busca por texto sem filtro de status
	@Query("SELECT p FROM Product p WHERE " +
		   "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
		   "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
		   "LOWER(p.detailedDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
	Page<Product> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
	
	// Filtros por categoria
	Page<Product> findByCategoryIdAndStatus(Long categoryId, boolean status, Pageable pageable);
	Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
	
	// Filtros por múltiplas categorias
	@Query("SELECT p FROM Product p JOIN p.categories c WHERE c.id = :categoryId AND p.status = :status")
	Page<Product> findByCategoriesIdAndStatus(@Param("categoryId") Long categoryId, @Param("status") boolean status, Pageable pageable);
	
	@Query("SELECT p FROM Product p JOIN p.categories c WHERE c.id IN :categoryIds AND p.status = :status")
	Page<Product> findByCategoriesIdInAndStatus(@Param("categoryIds") List<Long> categoryIds, @Param("status") boolean status, Pageable pageable);
	
	// Filtros por preço
	Page<Product> findByPriceBetweenAndStatus(Double minPrice, Double maxPrice, boolean status, Pageable pageable);
	Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);
	
	// Filtros por estoque
	Page<Product> findByQuantityGreaterThanAndStatus(Integer minStock, boolean status, Pageable pageable);
	Page<Product> findByQuantityGreaterThan(Integer minStock, Pageable pageable);
	
	// Filtros por preço e estoque
	@Query("SELECT p FROM Product p WHERE p.status = :status AND " +
		   "p.price BETWEEN :minPrice AND :maxPrice AND " +
		   "p.quantity >= :minStock")
	Page<Product> findByPriceAndStockAndStatus(@Param("minPrice") Double minPrice, 
											  @Param("maxPrice") Double maxPrice, 
											  @Param("minStock") Integer minStock, 
											  @Param("status") boolean status, 
											  Pageable pageable);
	
	// Filtros por preço e estoque sem status
	@Query("SELECT p FROM Product p WHERE " +
		   "p.price BETWEEN :minPrice AND :maxPrice AND " +
		   "p.quantity >= :minStock")
	Page<Product> findByPriceAndStock(@Param("minPrice") Double minPrice, 
									 @Param("maxPrice") Double maxPrice, 
									 @Param("minStock") Integer minStock, 
									 Pageable pageable);
	
	// Busca avançada com múltiplos filtros
	@Query("SELECT p FROM Product p WHERE " +
		   "(:status IS NULL OR p.status = :status) AND " +
		   "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
		   "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
		   "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
		   "(:minStock IS NULL OR p.quantity >= :minStock) AND " +
		   "(:maxStock IS NULL OR p.quantity <= :maxStock) AND " +
		   "(:searchTerm IS NULL OR " +
		   "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
		   "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
		   "LOWER(p.detailedDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
	Page<Product> findByAdvancedFilters(@Param("status") Boolean status,
									  @Param("categoryId") Long categoryId,
									  @Param("minPrice") Double minPrice,
									  @Param("maxPrice") Double maxPrice,
									  @Param("minStock") Integer minStock,
									  @Param("maxStock") Integer maxStock,
									  @Param("searchTerm") String searchTerm,
									  Pageable pageable);
	
	// Estatísticas de preço
	@Query("SELECT MIN(p.price) FROM Product p WHERE p.status = :status")
	Double findMinPriceByStatus(@Param("status") boolean status);
	
	@Query("SELECT MAX(p.price) FROM Product p WHERE p.status = :status")
	Double findMaxPriceByStatus(@Param("status") boolean status);
	
	// Estatísticas de estoque
	@Query("SELECT MIN(p.quantity) FROM Product p WHERE p.status = :status")
	Integer findMinStockByStatus(@Param("status") boolean status);
	
	@Query("SELECT MAX(p.quantity) FROM Product p WHERE p.status = :status")
	Integer findMaxStockByStatus(@Param("status") boolean status);
	
	// Contagem por categoria
	@Query("SELECT p.category.id, p.category.name, COUNT(p) FROM Product p " +
		   "WHERE p.status = :status GROUP BY p.category.id, p.category.name")
	List<Object[]> countByCategoryAndStatus(@Param("status") boolean status);
	
	// Contagem total por status
	Long countByStatus(boolean status);
}