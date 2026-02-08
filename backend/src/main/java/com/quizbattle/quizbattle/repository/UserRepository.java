package com.quizbattle.quizbattle.repository;

import com.quizbattle.quizbattle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

