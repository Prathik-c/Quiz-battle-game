package com.quizbattle.quizbattle.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScoreUpdateDTO {
    private Long playerGameId;
    private int score;
}
