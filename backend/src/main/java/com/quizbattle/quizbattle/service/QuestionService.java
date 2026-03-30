package com.quizbattle.quizbattle.service;

import com.quizbattle.quizbattle.entity.Question;

import java.util.List;

public interface QuestionService {

    Question createQuestion(Long quizId, Question question);

    List<Question> getQuestionsByQuizId(Long quizId);
    
    Question updateQuestion(Long id, Question question);
    
    void deleteQuestion(Long id);
}
