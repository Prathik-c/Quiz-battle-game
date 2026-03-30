package com.quizbattle.quizbattle.controller;

import com.quizbattle.quizbattle.dto.AnswerMessage;
import com.quizbattle.quizbattle.entity.Question;
import com.quizbattle.quizbattle.repository.QuestionRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.HashMap;
import java.util.Map;

@Controller
public class GameWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final QuestionRepository questionRepository;

    public GameWebSocketController(SimpMessagingTemplate messagingTemplate,
                                   QuestionRepository questionRepository) {
        this.messagingTemplate = messagingTemplate;
        this.questionRepository = questionRepository;
    }

    @MessageMapping("/answer")
    public void receiveAnswer(AnswerMessage message) {
        
        // Validate the answer using actual database logic
        Question question = questionRepository.findById(message.getQuestionId())
                .orElse(null);
        
        if (question == null) {
            messagingTemplate.convertAndSend(
                    "/topic/game/" + message.getGameId(),
                    createErrorResponse("Question not found")
            );
            return;
        }

        boolean isCorrect = compareAnswers(question.getCorrectOption(), message.getSelectedOption());

        Map<String, Object> response = new HashMap<>();
        response.put("userId", message.getUserId());
        response.put("gameId", message.getGameId());
        response.put("questionId", message.getQuestionId());
        response.put("selectedOption", message.getSelectedOption());
        response.put("correctAnswer", question.getCorrectOption());
        response.put("isCorrect", isCorrect);
        response.put("message", isCorrect ? "Correct!" : "Incorrect! The correct answer is: " + question.getCorrectOption());

        // Broadcast to all players in this game
        messagingTemplate.convertAndSend(
                "/topic/game/" + message.getGameId(),
                response
        );
    }

    private boolean compareAnswers(String correctAnswer, String selectedOption) {
        if (correctAnswer == null || selectedOption == null) {
            return false;
        }
        return correctAnswer.equals(selectedOption.trim().toUpperCase());
    }

    private Map<String, Object> createErrorResponse(String errorMessage) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", true);
        error.put("message", errorMessage);
        return error;
    }
}

