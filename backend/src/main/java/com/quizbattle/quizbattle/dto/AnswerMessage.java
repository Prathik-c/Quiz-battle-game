package com.quizbattle.quizbattle.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AnswerMessage {

    private Long gameId;
    private Long userId;
    private Long questionId;
    private String selectedOption;

    // getters & setters

}

