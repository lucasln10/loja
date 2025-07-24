package com.lojacrysleao.lojacrysleao_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lojacrysleao.lojacrysleao_api.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
