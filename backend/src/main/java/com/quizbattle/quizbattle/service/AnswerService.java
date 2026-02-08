package com.quizbattle.quizbattle.service;

import com.quizbattle.quizbattle.entity.Answer;

public interface AnswerService {
    Answer submitAnswer(Long userId, Long questionId, String selectedOption);
}

