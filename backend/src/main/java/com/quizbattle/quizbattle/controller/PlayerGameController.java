package com.quizbattle.quizbattle.controller;

import com.quizbattle.quizbattle.entity.PlayerGame;
import com.quizbattle.quizbattle.service.PlayerGameService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/players")
@CrossOrigin(origins = "http://localhost:8080")
public class PlayerGameController {

    private final PlayerGameService playerGameService;

    public PlayerGameController(PlayerGameService playerGameService) {
        this.playerGameService = playerGameService;
    }

    @PostMapping("/join")
    public PlayerGame joinGame(@RequestParam Long userId,
                               @RequestParam Long gameId) {
        return playerGameService.joinGame(userId, gameId);
    }
}
