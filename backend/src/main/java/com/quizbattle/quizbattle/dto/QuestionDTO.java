package com.quizbattle.quizbattle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for Question response - avoids exposing quiz relationship to prevent circular references
 * ALTERNATIVE SOLUTION for LazyInitializationException
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    
    private Long id;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;
    // Note: We intentionally exclude the quiz field to prevent circular references
}
