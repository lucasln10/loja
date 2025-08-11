package com.lojacrysleao.lojacrysleao_api.service.lojaService;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CarouselItemDTO;
import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.CarouselItemMapper;
import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselItem;
import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselType;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.CarouselItemRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CarouselItemServiceTest {
    @Mock
    private CarouselItemRepository carouselItemRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private CarouselItemMapper carouselItemMapper;
    @InjectMocks
    private CarouselItemService carouselItemService;
    private CarouselItem item;
    private CarouselItemDTO itemDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        item = new CarouselItem();
        item.setId(1L);
        item.setActive(true);
        itemDTO = new CarouselItemDTO();
        itemDTO.setId(1L);
        when(carouselItemMapper.toDTO(item)).thenReturn(itemDTO);
        when(carouselItemRepository.findActiveCarouselItems()).thenReturn(Collections.singletonList(item));
        when(carouselItemRepository.findAll()).thenReturn(Collections.singletonList(item));
    when(carouselItemRepository.findByCarouselTypeAndActiveOrderByDisplayOrderAsc(CarouselType.PRODUCT, true)).thenReturn(Collections.singletonList(item));
        when(carouselItemRepository.findById(1L)).thenReturn(Optional.of(item));
    }

    @Test
    void testGetActiveCarouselItems() {
        List<CarouselItemDTO> list = carouselItemService.getActiveCarouselItems();
        assertEquals(1, list.size());
        assertEquals(1L, list.get(0).getId());
    }

    @Test
    void testGetAllCarouselItems() {
        List<CarouselItemDTO> list = carouselItemService.getAllCarouselItems();
        assertEquals(1, list.size());
    }

    @Test
    void testGetCarouselItemsByType() {
    List<CarouselItemDTO> list = carouselItemService.getCarouselItemsByType(CarouselType.PRODUCT);
        assertEquals(1, list.size());
    }

    @Test
    void testGetCarouselItemById() {
        Optional<CarouselItemDTO> found = carouselItemService.getCarouselItemById(1L);
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }

    @Test
    void testGetCarouselItemByIdNotFound() {
        when(carouselItemRepository.findById(2L)).thenReturn(Optional.empty());
        Optional<CarouselItemDTO> found = carouselItemService.getCarouselItemById(2L);
        assertFalse(found.isPresent());
    }
}
