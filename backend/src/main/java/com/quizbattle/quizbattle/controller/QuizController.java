package com.quizbattle.quizbattle.controller;

import com.quizbattle.quizbattle.entity.Quiz;
import com.quizbattle.quizbattle.service.QuizService;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/quizzes")
@CrossOrigin(origins = "http://localhost:8080")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }
    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizService.createQuiz(quiz);
    }

}



