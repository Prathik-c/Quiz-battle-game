package com.quizbattle.quizbattle.repository;

import com.quizbattle.quizbattle.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}

