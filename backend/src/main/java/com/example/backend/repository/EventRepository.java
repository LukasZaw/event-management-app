package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Event;
import com.example.backend.model.User;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByLocation(String location);

    List<Event> findByDateTimeAfter(LocalDateTime dateTime);

    List<Event> findByOrganizer(User organizer);
}
