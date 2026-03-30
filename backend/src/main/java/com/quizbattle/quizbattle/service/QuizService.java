package com.quizbattle.quizbattle.service;

import com.quizbattle.quizbattle.entity.Quiz;
import java.util.List;

public interface QuizService {
    List<Quiz> getAllQuizzes();
    
    Quiz getQuizById(Long id);
    
    Quiz createQuiz(Quiz quiz);
    
    Quiz updateQuiz(Long id, Quiz quiz);
    
    void deleteQuiz(Long id);

}

