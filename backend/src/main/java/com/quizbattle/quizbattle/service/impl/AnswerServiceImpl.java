package com.quizbattle.quizbattle.service.impl;

import com.quizbattle.quizbattle.entity.*;
import com.quizbattle.quizbattle.repository.*;
import com.quizbattle.quizbattle.service.AnswerService;
import com.quizbattle.quizbattle.service.AnswerService;
import org.springframework.stereotype.Service;


@Service
public class AnswerServiceImpl implements AnswerService {

    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    public AnswerServiceImpl(AnswerRepository answerRepository,
                             UserRepository userRepository,
                             QuestionRepository questionRepository) {
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public Answer submitAnswer(Long userId, Long questionId, String selectedOption) {

        User user = userRepository.findById(userId).orElseThrow();
        Question question = questionRepository.findById(questionId).orElseThrow();

        boolean isCorrect = question.getCorrectOption().equals(selectedOption);

        Answer answer = new Answer();
        answer.setUser(user);
        answer.setQuestion(question);
        answer.setSelectedOption(selectedOption);
        answer.setCorrect(isCorrect);

        return answerRepository.save(answer);
    }
}

