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

    List<Event> findByDateTime(LocalDateTime dateTime);
    
    List<Event> findByDateTimeAndLocation(LocalDateTime dateTime, String location);

    List<Event> findByDateTimeAndLocationAndOrganizer(LocalDateTime dateTime, String location, User organizer);

    List<Event> findByDateTimeAndOrganizer(LocalDateTime dateTime, User organizer);

    List<Event> findByLocationAndOrganizer(String location, User organizer);
}
