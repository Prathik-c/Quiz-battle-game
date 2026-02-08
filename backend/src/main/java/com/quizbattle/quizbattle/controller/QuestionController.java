package com.quizbattle.quizbattle.controller;

import com.quizbattle.quizbattle.entity.Question;
import com.quizbattle.quizbattle.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "http://localhost:8080")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // Add question to a quiz
    @PostMapping("/quiz/{quizId}")
    public Question createQuestion(
            @PathVariable Long quizId,
            @RequestBody Question question) {

        return questionService.createQuestion(quizId, question);
    }

    // Get questions of a quiz
    @GetMapping("/quiz/{quizId}")
    public List<Question> getQuestions(@PathVariable Long quizId) {
        return questionService.getQuestionsByQuizId(quizId);
    }
}
