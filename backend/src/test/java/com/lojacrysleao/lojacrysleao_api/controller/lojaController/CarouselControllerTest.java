package com.lojacrysleao.lojacrysleao_api.controller.lojaController;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CarouselItemDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselType;
import com.lojacrysleao.lojacrysleao_api.service.lojaService.CarouselItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.Collections;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CarouselControllerTest {
    @Mock
    private CarouselItemService carouselItemService;
    @InjectMocks
    private CarouselController carouselController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(carouselController).build();
    }

    @Test
    void testGetActiveCarouselItems() throws Exception {
        when(carouselItemService.getActiveCarouselItems()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/carousel/active").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testGetCarouselItemsByType() throws Exception {
        when(carouselItemService.getCarouselItemsByType(CarouselType.PRODUCT)).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/carousel/active/PRODUCT"))
                .andExpect(status().isOk());
    }
}
