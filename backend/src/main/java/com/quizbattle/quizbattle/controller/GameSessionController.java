package com.quizbattle.quizbattle.controller;

import com.quizbattle.quizbattle.entity.GameSession;
import com.quizbattle.quizbattle.service.GameSessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
public class GameSessionController {

    private final GameSessionService gameSessionService;

    public GameSessionController(GameSessionService gameSessionService) {
        this.gameSessionService = gameSessionService;
    }

    @PostMapping("/create/{quizId}")
    public GameSession create(@PathVariable Long quizId) {
        try {
            return gameSessionService.createGameSession(quizId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create game: " + e.getMessage(), e);
        }
    }

    @PutMapping("/start/{gameId}")
    public GameSession start(@PathVariable Long gameId) {
        try {
            return gameSessionService.startGame(gameId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to start game: " + e.getMessage(), e);
        }
    }

    @PutMapping("/complete/{gameId}")
    public GameSession complete(@PathVariable Long gameId) {
        try {
            return gameSessionService.completeGame(gameId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to complete game: " + e.getMessage(), e);
        }
    }

    @GetMapping("/{gameId}")
    public GameSession get(@PathVariable Long gameId) {
        try {
            return gameSessionService.getGameSession(gameId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch game: " + e.getMessage(), e);
        }
    }

    @GetMapping
    public List<GameSession> all() {
        try {
            return gameSessionService.getAllGameSessions();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch games: " + e.getMessage(), e);
        }
    }
}