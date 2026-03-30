package com.quizbattle.quizbattle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

/**
 * DTO for Quiz response - prevents circular references and controls what data is returned
 * ALTERNATIVE SOLUTION for LazyInitializationException
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    
    private Long id;
    private String title;
    private String description;
    private List<QuestionDTO> questions;
}
