package com.lojacrysleao.lojacrysleao_api.repository.lojaRepository;

import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselItem;
import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarouselItemRepository extends JpaRepository<CarouselItem, Long> {
    
    List<CarouselItem> findByActiveOrderByDisplayOrderAsc(Boolean active);
    
    @Query("SELECT c FROM CarouselItem c WHERE c.active = true ORDER BY c.displayOrder ASC")
    List<CarouselItem> findActiveCarouselItems();
    
    List<CarouselItem> findByCarouselTypeAndActiveOrderByDisplayOrderAsc(CarouselType carouselType, Boolean active);
    
    @Query("SELECT MAX(c.displayOrder) FROM CarouselItem c")
    Integer findMaxDisplayOrder();
}
