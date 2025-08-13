package com.lojacrysleao.lojacrysleao_api.repository.userRepository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lojacrysleao.lojacrysleao_api.model.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findByEmail (String email);

    @Query("SELECT u FROM User u WHERE u.enable = false AND u.createdAt < :date")
    List<User> findUnverifiedOlderThan(LocalDateTime date);
}
