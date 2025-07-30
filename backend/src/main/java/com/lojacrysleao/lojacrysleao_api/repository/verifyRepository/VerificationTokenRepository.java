package com.lojacrysleao.lojacrysleao_api.repository.verifyRepository;

import com.lojacrysleao.lojacrysleao_api.model.verify.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
