package com.quizbattle.quizbattle.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "game_session")
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Setter
    @Column(nullable = false)
    private int currentQuestionIndex = 0;

    @Setter
    @Column(nullable = false)
    private int score = 0;

    public enum GameStatus {
        CREATED,
        STARTED,
        COMPLETED
    }

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameStatus status = GameStatus.CREATED;

    // -------- REQUIRED GETTERS --------

    // -------- REQUIRED SETTERS --------

}

