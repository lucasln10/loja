package com.lojacrysleao.lojacrysleao_api.repository.storageRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;

@Repository
public interface StorageRepository extends JpaRepository<Storage, Long> {
    Optional<Storage> findByProductId(Long productId);

    List<Storage> findByQuantityLessThanEqual(int threshold);
}
