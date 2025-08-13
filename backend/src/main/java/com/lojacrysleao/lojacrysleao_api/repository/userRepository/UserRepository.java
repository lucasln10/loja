package com.lojacrysleao.lojacrysleao_api.repository.userRepository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lojacrysleao.lojacrysleao_api.model.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findByEmail (String email);

    //List<User> findByInactiveUserEqual (int days);
}
