package com.quizbattle.quizbattle.repository;

import com.quizbattle.quizbattle.entity.PlayerGame;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlayerGameRepository extends JpaRepository<PlayerGame, Long> {

    Optional<PlayerGame> findByUserIdAndGameSessionId(Long userId, Long gameId);
}

