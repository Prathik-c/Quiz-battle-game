package com.quizbattle.quizbattle.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnswerSubmitResponse {
    private Long answerId;
    private boolean correct;
    private String correctAnswer;
    private int updatedScore;
    private String message;
}
