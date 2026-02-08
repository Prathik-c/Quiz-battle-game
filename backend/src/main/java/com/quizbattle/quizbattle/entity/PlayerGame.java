package com.quizbattle.quizbattle.entity;

import jakarta.persistence.*;
import lombok.Setter;

@Entity
@Table(
        name = "player_game",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "game_id"})
        }
)
public class PlayerGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private GameSession gameSession;

    @Column(nullable = false)
    private int score = 0;

    // getters & setters
    public Long getId() { return id; }

    public User getUser() { return user; }

    public GameSession getGameSession() { return gameSession; }
    public void setGameSession(GameSession gameSession) { this.gameSession = gameSession; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}
