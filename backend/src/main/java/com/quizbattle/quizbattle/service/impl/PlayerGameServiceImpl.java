package com.quizbattle.quizbattle.service.impl;

import com.quizbattle.quizbattle.dto.ScoreUpdateDTO;
import com.quizbattle.quizbattle.entity.GameSession;
import com.quizbattle.quizbattle.entity.PlayerGame;
import com.quizbattle.quizbattle.entity.User;
import com.quizbattle.quizbattle.repository.GameSessionRepository;
import com.quizbattle.quizbattle.repository.PlayerGameRepository;
import com.quizbattle.quizbattle.repository.UserRepository;
import com.quizbattle.quizbattle.service.PlayerGameService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class PlayerGameServiceImpl implements PlayerGameService {

    private final PlayerGameRepository playerGameRepository;
    private final UserRepository userRepository;
    private final GameSessionRepository gameSessionRepository;
    private final SimpMessagingTemplate messagingTemplate;


    public PlayerGameServiceImpl(
            PlayerGameRepository playerGameRepository,
            UserRepository userRepository,
            GameSessionRepository gameSessionRepository,
            SimpMessagingTemplate messagingTemplate) {

        this.playerGameRepository = playerGameRepository;
        this.userRepository = userRepository;
        this.gameSessionRepository = gameSessionRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public PlayerGame joinGame(Long userId, Long gameId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        GameSession game = gameSessionRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        PlayerGame pg = new PlayerGame();
        pg.setUser(user);
        pg.setGameSession(game);
        pg.setScore(0);

        return playerGameRepository.save(pg);
    }

    @Override
    public PlayerGame updateScore(Long userId, Long gameId, int score) {

        PlayerGame pg = playerGameRepository
                .findByUserIdAndGameSessionId(userId, gameId)
                .orElseThrow(() -> new RuntimeException("Player not in game"));

        pg.setScore(score);
        PlayerGame saved = playerGameRepository.save(pg);


        messagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/score",
                new ScoreUpdateDTO(saved.getId(), saved.getScore())
        );

        return saved;
    }
}
