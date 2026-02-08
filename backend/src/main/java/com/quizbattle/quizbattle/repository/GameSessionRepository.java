package com.quizbattle.quizbattle.repository;
import com.quizbattle.quizbattle.entity.GameSession;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
}

