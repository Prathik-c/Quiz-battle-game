package com.quizbattle.quizbattle.service;
import com.quizbattle.quizbattle.entity.GameSession;

import java.util.List;

public interface GameSessionService {

    GameSession createGameSession(Long quizId);

    GameSession getGameSession(Long gameId);

    List<GameSession> getAllGameSessions();

    GameSession startGame(Long gameId);

    GameSession completeGame(Long gameId);
}

