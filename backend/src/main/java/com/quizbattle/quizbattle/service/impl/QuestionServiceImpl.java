package com.quizbattle.quizbattle.service.impl;

import com.quizbattle.quizbattle.entity.Question;
import com.quizbattle.quizbattle.entity.Quiz;
import com.quizbattle.quizbattle.repository.QuestionRepository;
import com.quizbattle.quizbattle.repository.QuizRepository;
import com.quizbattle.quizbattle.service.QuestionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository,
                               QuizRepository quizRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
    }

    @Override
    public Question createQuestion(Long quizId, Question question) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        question.setQuiz(quiz);
        return questionRepository.save(question);
    }

    @Override
    public List<Question> getQuestionsByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }
}
