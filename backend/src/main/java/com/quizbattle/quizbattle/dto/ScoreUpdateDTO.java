package com.quizbattle.quizbattle.dto;

public class ScoreUpdateDTO {

    private Long playerGameId;
    private int score;

    public ScoreUpdateDTO(Long playerGameId, int score) {
        this.playerGameId = playerGameId;
        this.score = score;
    }

    public Long getPlayerGameId() {
        return playerGameId;
    }

    public int getScore() {
        return score;
    }
}
