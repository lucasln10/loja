package com.lojacrysleao.lojacrysleao_api.repository.userRepository;

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
import java.time.LocalDateTime;
>>>>>>> 236ef02deb3259031b99b26a0c5e807b880f7dac
=======
import java.time.LocalDateTime;
=======
>>>>>>> 39ef745 (corrigindo metodos e adicionando imports)
>>>>>>> Stashed changes
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
import org.springframework.data.repository.query.Param;
>>>>>>> 236ef02deb3259031b99b26a0c5e807b880f7dac
=======
import org.springframework.data.repository.query.Param;
=======
>>>>>>> 39ef745 (corrigindo metodos e adicionando imports)
>>>>>>> Stashed changes
import org.springframework.stereotype.Repository;

import com.lojacrysleao.lojacrysleao_api.model.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findByEmail (String email);

    @Query("SELECT u FROM User u WHERE u.enable = false AND u.createdAt < :date")
    List<User> findUnverifiedOlderThan(@Param("date") LocalDateTime date);
}
