package com.lojacrysleao.lojacrysleao_api.repository.userRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lojacrysleao.lojacrysleao_api.model.user.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findByEmail (String email);
}
