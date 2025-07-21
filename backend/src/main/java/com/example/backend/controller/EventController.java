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

    @GetMapping
    public List<Event> getAllEvents(
            @RequestParam(required = false) LocalDateTime date,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String organizerId) {
        if (organizerId != null) {
            User organizer = userRepository.findByEmail(organizerId);
            if (organizer == null) {
                return List.of(); // Zwróć pustą listę, jeśli organizator nie istnieje
            }
            if (date != null && location != null) {
                return eventRepository.findByDateTimeAndLocationAndOrganizer(date, location, organizer);
            } else if (date != null) {
                return eventRepository.findByDateTimeAndOrganizer(date, organizer);
            } else if (location != null) {
                return eventRepository.findByLocationAndOrganizer(location, organizer);
            } else {
                return eventRepository.findByOrganizer(organizer);
            }
        } else if (date != null && location != null) {
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
        // Walidacja pól eventu
        if (event.getTitle() == null || event.getTitle().length() < 3 || event.getTitle().length() > 100) {
            return ResponseEntity.badRequest().body(null);
        }
        if (event.getDescription() == null || event.getDescription().length() < 10) {
            return ResponseEntity.badRequest().body(null);
        }
        if (event.getDateTime() == null || event.getDateTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(null);
        }
        if (event.getLocation() == null || event.getLocation().length() < 3) {
            return ResponseEntity.badRequest().body(null);
        }
        if (event.getTotalSeats() < 1) {
            return ResponseEntity.badRequest().body(null);
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
        // Walidacja właściciela wydarzenia
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User organizer = userRepository.findByEmail(email);
        if (organizer == null || !event.getOrganizer().getId().equals(organizer.getId())) {
            return ResponseEntity.status(403).build();
        }
        // Walidacja pól eventu
        if (eventDetails.getTitle() == null || eventDetails.getTitle().length() < 3 || eventDetails.getTitle().length() > 100) {
            return ResponseEntity.badRequest().body(null);
        }
        if (eventDetails.getDescription() == null || eventDetails.getDescription().length() < 10) {
            return ResponseEntity.badRequest().body(null);
        }
        if (eventDetails.getDateTime() == null || eventDetails.getDateTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(null);
        }
        if (eventDetails.getLocation() == null || eventDetails.getLocation().length() < 3) {
            return ResponseEntity.badRequest().body(null);
        }
        if (eventDetails.getTotalSeats() < 1) {
            return ResponseEntity.badRequest().body(null);
        }
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
        Event event = eventOpt.get();
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User organizer = userRepository.findByEmail(email);
        if (organizer == null || !event.getOrganizer().getId().equals(organizer.getId())) {
            return ResponseEntity.status(403).build();
        }
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
