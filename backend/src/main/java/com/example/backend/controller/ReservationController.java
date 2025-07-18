package com.example.backend.controller;

import com.example.backend.model.Event;
import com.example.backend.model.Reservation;
import com.example.backend.model.User;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public ReservationController(ReservationService reservationService, UserRepository userRepository, EventRepository eventRepository) {
        this.reservationService = reservationService;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    // Rezerwacja miejsca na wydarzeniu
    @PostMapping
    @PreAuthorize("hasAuthority('PARTICIPANT')")
    public ResponseEntity<?> reserve(@RequestParam Long eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (user == null || eventOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Nieprawidłowy użytkownik lub wydarzenie");
        }
        try {
            Reservation reservation = reservationService.reserve(user, eventOpt.get());
            return ResponseEntity.ok(reservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Anulowanie rezerwacji (tylko uczestnik, tylko własna rezerwacja)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PARTICIPANT')")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        Optional<Reservation> reservationOpt = reservationService.getReservationById(id);
        if (reservationOpt.isEmpty() || !reservationOpt.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Brak uprawnień do anulowania tej rezerwacji");
        }
        reservationService.cancelReservation(id);
        return ResponseEntity.ok().build();
    }

    // Lista własnych rezerwacji (tylko uczestnik)
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('PARTICIPANT')")
    public ResponseEntity<List<Reservation>> getMyReservations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        List<Reservation> reservations = reservationService.getReservationsByUser(user);
        return ResponseEntity.ok(reservations);
    }

    // Lista rezerwacji dla wydarzenia (tylko organizator)
    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAuthority('ORGANIZER')")
    public ResponseEntity<List<Reservation>> getReservationsForEvent(@PathVariable Long eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User organizer = userRepository.findByEmail(email);
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Event event = eventOpt.get();
        if (!event.getOrganizer().getId().equals(organizer.getId())) {
            return ResponseEntity.status(403).body(null);
        }
        List<Reservation> reservations = reservationService.getReservationsByEvent(event);
        return ResponseEntity.ok(reservations);
    }
}
