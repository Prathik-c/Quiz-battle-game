package com.quizbattle.quizbattle.util;

import com.quizbattle.quizbattle.dto.QuestionDTO;
import com.quizbattle.quizbattle.dto.QuizDTO;
import com.quizbattle.quizbattle.entity.Question;
import com.quizbattle.quizbattle.entity.Quiz;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility for converting entities to DTOs
 * ALTERNATIVE SOLUTION - Use this instead of returning entities directly
 */
@Component
public class QuizMapper {
    
    public QuizDTO toDTO(Quiz quiz) {
        if (quiz == null) {
            return null;
        }
        
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        
        if (quiz.getQuestions() != null) {
            dto.setQuestions(
                quiz.getQuestions().stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList())
            );
        }
        
        return dto;
    }
    
    public QuestionDTO toDTO(Question question) {
        if (question == null) {
            return null;
        }
        
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        
        return dto;
    }
    
    public List<QuizDTO> toDTOList(List<Quiz> quizzes) {
        return quizzes.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
