package com.quizbattle.quizbattle.controller;

import com.quizbattle.quizbattle.dto.AnswerSubmitRequest;
import com.quizbattle.quizbattle.dto.AnswerSubmitResponse;
import com.quizbattle.quizbattle.service.impl.AnswerServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/answers")
public class AnswerController {

    private final AnswerServiceImpl answerService;

    public AnswerController(AnswerServiceImpl answerService) {
        this.answerService = answerService;
    }

    @PostMapping
    public AnswerSubmitResponse submitAnswer(@RequestBody AnswerSubmitRequest request) {
        if (request.getGameId() == null || request.getQuestionId() == null || request.getOptionId() == null) {
            throw new IllegalArgumentException("gameId, questionId, and optionId are required");
        }
        return answerService.submitAnswerWithResponse(request.getGameId(), request.getQuestionId(), request.getOptionId());
    }
}