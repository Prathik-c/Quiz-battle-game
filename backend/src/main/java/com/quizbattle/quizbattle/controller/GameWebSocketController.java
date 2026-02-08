package com.quizbattle.quizbattle.controller;

import com.quizbattle.quizbattle.dto.AnswerMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public GameWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/answer")
    public void receiveAnswer(AnswerMessage message) {

        // SIMPLE correctness logic (temporary)
        boolean isCorrect = message.getSelectedOption().equalsIgnoreCase("A");

        String response =
                "User " + message.getUserId() +
                        " answered Question " + message.getQuestionId() +
                        " | Correct: " + isCorrect;

        // Broadcast to all players in this game
        messagingTemplate.convertAndSend(
                "/topic/game/" + message.getGameId(),
                response
        );
    }
}

