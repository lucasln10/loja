package com.lojacrysleao.lojacrysleao_api.dto.storageDTO;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StorageDTO {

    private Long id;

    private int quantity;

    private int reservation;

    private Product product_id;

}
