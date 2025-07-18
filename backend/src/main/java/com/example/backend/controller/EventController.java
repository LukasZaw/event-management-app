package com.example.backend.controller;

import com.example.backend.model.Event;
import com.example.backend.model.Reservation;
import com.example.backend.model.User;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventRepository eventRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public EventController(EventRepository eventRepository, ReservationRepository reservationRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    // Pobierz wszystkie wydarzenia (dostępne dla wszystkich)
    @GetMapping
    public List<Event> getAllEvents(@RequestParam(required = false) LocalDateTime date,
                                    @RequestParam(required = false) String location) {
        if (date != null && location != null) {
            return eventRepository.findByDateTimeAndLocation(date, location);
        } else if (date != null) {
            return eventRepository.findByDateTime(date);
        } else if (location != null) {
            return eventRepository.findByLocation(location);
        } else {
            return eventRepository.findAll();
        }
    }

    // Pobierz pojedyncze wydarzenie
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEvent(@PathVariable Long id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Utwórz nowe wydarzenie (tylko organizator)
    @PostMapping
    @PreAuthorize("hasAuthority('ORGANIZER')")
    public ResponseEntity<Event> createEvent(@Valid @RequestBody Event event) {
        // Pobierz email zalogowanego użytkownika
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User organizer = userRepository.findByEmail(email);
        if (organizer == null) {
            return ResponseEntity.status(401).build();
        }
        event.setOrganizer(organizer); // Ustaw organizatora
        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }

    // Edytuj wydarzenie (tylko organizator, właściciel wydarzenia)
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ORGANIZER')")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody Event eventDetails) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isEmpty()) return ResponseEntity.notFound().build();
        Event event = eventOpt.get();
        // TODO: sprawdź czy aktualny użytkownik to właściciel wydarzenia
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setDateTime(eventDetails.getDateTime());
        event.setLocation(eventDetails.getLocation());
        event.setTotalSeats(eventDetails.getTotalSeats());
        Event updated = eventRepository.save(event);
        return ResponseEntity.ok(updated);
    }

    // Usuń wydarzenie (tylko organizator, właściciel wydarzenia)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ORGANIZER')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isEmpty()) return ResponseEntity.notFound().build();
        // TODO: sprawdź czy aktualny użytkownik to właściciel wydarzenia
        eventRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Lista uczestników zapisanych na wydarzenie (tylko organizator, właściciel wydarzenia)
    @GetMapping("/{id}/participants")
    @PreAuthorize("hasAuthority('ORGANIZER')")
    public ResponseEntity<List<User>> getEventParticipants(@PathVariable Long id) {
        List<Reservation> reservations = reservationRepository.findByEventId(id);
        List<User> users = reservations.stream().map(Reservation::getUser).toList();
        return ResponseEntity.ok(users);
    }
}
