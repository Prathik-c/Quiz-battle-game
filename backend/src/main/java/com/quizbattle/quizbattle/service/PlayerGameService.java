package com.quizbattle.quizbattle.service;

import com.quizbattle.quizbattle.entity.PlayerGame;

public interface PlayerGameService {

    PlayerGame joinGame(Long userId, Long gameId);

    PlayerGame updateScore(Long userId, Long gameId, int score);
}

