package com.example.backend.service;

import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Tworzenie wydarzenia
    @Transactional
    public Event createEvent(String title, String description, LocalDateTime dateTime, String location, int totalSeats, User organizer) {
        if (title == null || title.length() < 3) {
            throw new IllegalArgumentException("Tytuł musi mieć co najmniej 3 znaki");
        }
        if (totalSeats <= 0) {
            throw new IllegalArgumentException("Liczba miejsc musi być większa od zera");
        }
        Event event = new Event(title, description, dateTime, location, totalSeats, organizer);
        return eventRepository.save(event);
    }

    // Edycja wydarzenia
    @Transactional
    public Event updateEvent(Long eventId, String title, String description, LocalDateTime dateTime, String location, int totalSeats) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Wydarzenie nie istnieje"));
        if (title != null && title.length() >= 3) event.setTitle(title);
        if (description != null) event.setDescription(description);
        if (dateTime != null) event.setDateTime(dateTime);
        if (location != null) event.setLocation(location);
        if (totalSeats > 0) event.setTotalSeats(totalSeats);
        return eventRepository.save(event);
    }

    // Usuwanie wydarzenia
    @Transactional
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    // Pobieranie wydarzenia po ID
    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    // Lista wydarzeń
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Filtrowanie po dacie
    public List<Event> getEventsAfterDate(LocalDateTime dateTime) {
        return eventRepository.findByDateTimeAfter(dateTime);
    }

    // Filtrowanie po lokalizacji
    public List<Event> getEventsByLocation(String location) {
        return eventRepository.findByLocation(location);
    }

    // Wydarzenia organizatora
    public List<Event> getEventsByOrganizer(User organizer) {
        return eventRepository.findByOrganizer(organizer);
    }

    // Wydarzenia po dacie
    public List<Event> getEventsByDate(LocalDateTime dateTime) {
        return eventRepository.findByDateTime(dateTime);
    }

    // Wydarzenia po dacie i lokalizacji
    public List<Event> getEventsByDateAndLocation(LocalDateTime dateTime, String location) {
        return eventRepository.findByDateTimeAndLocation(dateTime, location);
    }
}
