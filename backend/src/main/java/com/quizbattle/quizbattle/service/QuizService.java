package com.quizbattle.quizbattle.service;

import com.quizbattle.quizbattle.entity.Quiz;
import java.util.List;

public interface QuizService {
    List<Quiz> getAllQuizzes();
    Quiz createQuiz(Quiz quiz);

}

