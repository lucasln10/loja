package com.lojacrysleao.lojacrysleao_api.repository.storageRepository;

import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StorageRepository extends JpaRepository<Storage, Long> {
    Optional<Storage> findByProduct_Id(Long productId);
}
