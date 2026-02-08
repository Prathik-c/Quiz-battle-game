package com.quizbattle.quizbattle.controller;
import com.quizbattle.quizbattle.entity.GameSession;
import com.quizbattle.quizbattle.service.GameSessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@CrossOrigin(origins = {"http://localhost:8080", "http://127.0.0.1:5500", "http://localhost:5500"})
public class GameSessionController {

    private final GameSessionService gameSessionService;

    public GameSessionController(GameSessionService gameSessionService) {
        this.gameSessionService = gameSessionService;
    }

    @PostMapping("/create/{quizId}")
    public GameSession create(@PathVariable Long quizId) {
        return gameSessionService.createGameSession(quizId);
    }

    @PutMapping("/start/{gameId}")
    public GameSession start(@PathVariable Long gameId) {
        return gameSessionService.startGame(gameId);
    }

    @PutMapping("/complete/{gameId}")
    public GameSession complete(@PathVariable Long gameId) {
        return gameSessionService.completeGame(gameId);
    }

    @GetMapping("/{gameId}")
    public GameSession get(@PathVariable Long gameId) {
        return gameSessionService.getGameSession(gameId);
    }

    @GetMapping
    public List<GameSession> all() {
        return gameSessionService.getAllGameSessions();
    }
}
