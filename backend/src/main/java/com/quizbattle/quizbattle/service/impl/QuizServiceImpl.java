package com.quizbattle.quizbattle.service.impl;

import com.quizbattle.quizbattle.entity.Quiz;
import com.quizbattle.quizbattle.repository.GameSessionRepository;
import com.quizbattle.quizbattle.repository.QuizRepository;
import com.quizbattle.quizbattle.service.QuizService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final GameSessionRepository gameSessionRepository;

    public QuizServiceImpl(QuizRepository quizRepository, GameSessionRepository gameSessionRepository) {
        this.quizRepository = quizRepository;
        this.gameSessionRepository = gameSessionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAllWithQuestions();
    }

    @Override
    @Transactional(readOnly = true)
    public Quiz getQuizById(Long id) {
        return quizRepository.findByIdWithQuestions(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with ID: " + id));
    }

    @Override
    @Transactional
    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    @Override
    @Transactional
    public Quiz updateQuiz(Long id, Quiz quiz) {
        Quiz existing = getQuizById(id);
        existing.setTitle(quiz.getTitle());
        existing.setDescription(quiz.getDescription());
        return quizRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteQuiz(Long id) {
        if (!quizRepository.existsById(id)) {
            throw new RuntimeException("Quiz not found with ID: " + id);
        }
        gameSessionRepository.deleteByQuizId(id);
        quizRepository.deleteById(id);
    }
}