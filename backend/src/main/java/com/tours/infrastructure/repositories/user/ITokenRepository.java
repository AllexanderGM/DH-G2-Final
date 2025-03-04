package com.tours.infrastructure.repositories.user;

import com.tours.infrastructure.entities.user.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.lang.ScopedValue;
import java.util.List;
import java.util.Optional;

public interface ITokenRepository extends JpaRepository<Token, Long> {
    List<Token> findAllValidIsFalseOrRevokedIsFalseByUserId(Long id);

    Optional<Token> findByToken(String jwtToken);
}
