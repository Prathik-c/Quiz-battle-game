package com.quizbattle.quizbattle.service.impl;

import com.quizbattle.quizbattle.entity.Quiz;
import com.quizbattle.quizbattle.repository.GameSessionRepository;
import com.quizbattle.quizbattle.repository.QuizRepository;
import com.quizbattle.quizbattle.service.GameSessionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.quizbattle.quizbattle.entity.GameSession;

import java.util.List;

@Service
public class GameSessionServiceImpl implements GameSessionService {

    private final GameSessionRepository gameSessionRepository;
    private final QuizRepository quizRepository;

    public GameSessionServiceImpl(GameSessionRepository gameSessionRepository,
                                  QuizRepository quizRepository) {
        this.gameSessionRepository = gameSessionRepository;
        this.quizRepository = quizRepository;
    }

    @Override
    @Transactional
    public GameSession createGameSession(Long quizId) {
        GameSession game = new GameSession();
        Quiz quiz = quizRepository.findByIdWithQuestions(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with ID: " + quizId));
        game.setQuiz(quiz);
        game.setStatus(GameSession.GameStatus.CREATED);
        game.setCurrentQuestionIndex(0);
        game.setScore(0);
        return gameSessionRepository.save(game);
    }


    @Override
    @Transactional(readOnly = true)
    public GameSession getGameSession(Long gameId) {
        return gameSessionRepository.findByIdWithQuiz(gameId)
                .orElseThrow(() -> new RuntimeException("Game session not found with ID: " + gameId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<GameSession> getAllGameSessions() {
        return gameSessionRepository.findAll();
    }

    @Override
    @Transactional
    public GameSession startGame(Long gameId) {
        GameSession session = getGameSession(gameId);
        session.setStatus(GameSession.GameStatus.STARTED);
        return gameSessionRepository.save(session);
    }

    @Override
    @Transactional
    public GameSession completeGame(Long gameId) {
        GameSession session = getGameSession(gameId);
        session.setStatus(GameSession.GameStatus.COMPLETED);
        return gameSessionRepository.save(session);
    }
}

