package com.quizbattle.quizbattle.service.impl;

import com.quizbattle.quizbattle.dto.AnswerSubmitResponse;
import com.quizbattle.quizbattle.entity.*;
import com.quizbattle.quizbattle.repository.*;
import com.quizbattle.quizbattle.service.AnswerService;
import org.springframework.stereotype.Service;


@Service
public class AnswerServiceImpl implements AnswerService {

    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final GameSessionRepository gameSessionRepository;

    public AnswerServiceImpl(AnswerRepository answerRepository,
                             UserRepository userRepository,
                             QuestionRepository questionRepository,
                             GameSessionRepository gameSessionRepository) {
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.gameSessionRepository = gameSessionRepository;
    }

    @Override
    public Answer submitAnswer(Long userId, Long questionId, String selectedOption) {

        User user = userRepository.findById(userId).orElseThrow(
            () -> new RuntimeException("User not found with ID: " + userId)
        );
        Question question = questionRepository.findById(questionId).orElseThrow(
            () -> new RuntimeException("Question not found with ID: " + questionId)
        );

        boolean isCorrect = compareAnswers(question.getCorrectOption(), selectedOption);

        Answer answer = new Answer();
        answer.setUser(user);
        answer.setQuestion(question);
        answer.setSelectedOption(selectedOption);
        answer.setCorrect(isCorrect);

        return answerRepository.save(answer);
    }

    public AnswerSubmitResponse submitAnswerWithResponse(Long gameId, Long questionId, String selectedOption) {
        Question question = questionRepository.findById(questionId).orElseThrow(
            () -> new RuntimeException("Question not found with ID: " + questionId)
        );
        GameSession gameSession = gameSessionRepository.findById(gameId).orElseThrow(
            () -> new RuntimeException("Game session not found with ID: " + gameId)
        );

        String correctOpt = question.getCorrectOption();
        String normalizedSelected = selectedOption != null ? selectedOption.trim().toUpperCase() : "";
        
        System.out.println("DEBUG - Correct Option: [" + correctOpt + "] (trimmed and upper)");
        System.out.println("DEBUG - Selected Option: [" + normalizedSelected + "] (trimmed and upper)");
        
        boolean isCorrect = compareAnswers(correctOpt, selectedOption);
        
        // Update game session score
        if (isCorrect) {
            gameSession.setScore(gameSession.getScore() + 10);
            gameSessionRepository.save(gameSession);
        }

        AnswerSubmitResponse response = new AnswerSubmitResponse();
        response.setCorrect(isCorrect);
        response.setCorrectAnswer(question.getCorrectOption());
        response.setUpdatedScore(gameSession.getScore());
        response.setMessage(isCorrect ? "Correct answer!" : "Incorrect answer.");

        return response;
    }

    private boolean compareAnswers(String correctAnswer, String selectedOption) {
        if (correctAnswer == null || selectedOption == null) {
            return false;
        }
        return correctAnswer.equals(selectedOption.trim().toUpperCase());
    }
}

