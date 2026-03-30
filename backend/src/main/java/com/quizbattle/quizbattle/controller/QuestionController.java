package com.quizbattle.quizbattle.controller;

import com.quizbattle.quizbattle.entity.Question;
import com.quizbattle.quizbattle.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")

public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // Add question to a quiz
    @PostMapping
    public Question createQuestion(@RequestBody Question question) {
        if (question.getQuiz() == null || question.getQuiz().getId() == null) {
            throw new RuntimeException("Quiz ID is required");
        }
        return questionService.createQuestion(question.getQuiz().getId(), question);
    }

    @PostMapping("/quiz/{quizId}")
    public Question createQuestionByQuizId(
            @PathVariable Long quizId,
            @RequestBody Question question) {

        return questionService.createQuestion(quizId, question);
    }

    // Get questions of a quiz
    @GetMapping("/quiz/{quizId}")
    public List<Question> getQuestions(@PathVariable Long quizId) {
        return questionService.getQuestionsByQuizId(quizId);
    }
    
    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        return questionService.updateQuestion(id, question);
    }
    
    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }
}
