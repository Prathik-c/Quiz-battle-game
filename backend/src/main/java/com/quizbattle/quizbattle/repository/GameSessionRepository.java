package com.quizbattle.quizbattle.repository;

import com.quizbattle.quizbattle.entity.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {

    @Query("SELECT g FROM GameSession g LEFT JOIN FETCH g.quiz LEFT JOIN FETCH g.quiz.questions WHERE g.id = :id")
    Optional<GameSession> findByIdWithQuiz(Long id);

    @Modifying
    @Query(value = "DELETE FROM game_session WHERE quiz_id = :quizId", nativeQuery = true)
    void deleteByQuizId(@Param("quizId") Long quizId);
}