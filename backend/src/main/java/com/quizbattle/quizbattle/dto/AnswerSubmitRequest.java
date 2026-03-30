package com.quizbattle.quizbattle.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnswerSubmitRequest {
    private Long gameId;
    private Long questionId;
    private String optionId;
}
