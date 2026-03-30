package com.quizbattle.quizbattle.controller;

import com.quizbattle.quizbattle.entity.Quiz;
import com.quizbattle.quizbattle.service.QuizService;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/quizzes")

public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        try {
            return quizService.getAllQuizzes();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch quizzes: " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        try {
            return quizService.getQuizById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch quiz: " + e.getMessage(), e);
        }
    }
    
    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        try {
            return quizService.createQuiz(quiz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create quiz: " + e.getMessage(), e);
        }
    }
    
    @PutMapping("/{id}")
    public Quiz updateQuiz(@PathVariable Long id, @RequestBody Quiz quiz) {
        try {
            return quizService.updateQuiz(id, quiz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update quiz: " + e.getMessage(), e);
        }
    }
    
    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        try {
            quizService.deleteQuiz(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete quiz: " + e.getMessage(), e);
        }
    }

}



