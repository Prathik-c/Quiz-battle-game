package com.quizbattle.quizbattle.repository;

import com.quizbattle.quizbattle.entity.Options;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionRepository extends JpaRepository<Options, Long> {
}

