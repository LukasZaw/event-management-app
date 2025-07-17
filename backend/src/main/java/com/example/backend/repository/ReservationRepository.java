package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Event;
import com.example.backend.model.Reservation;
import com.example.backend.model.User;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUser(User user);

    List<Reservation> findByEvent(Event event);

    boolean existsByUserAndEvent(User user, Event event);
}
