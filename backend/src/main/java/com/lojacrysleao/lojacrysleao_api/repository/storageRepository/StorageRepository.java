package com.lojacrysleao.lojacrysleao_api.repository.storageRepository;

import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorageRepository extends JpaRepository<Storage, Long> {
}
