package com.example.backend.service;

import com.example.backend.model.Event;
import com.example.backend.model.Reservation;
import com.example.backend.model.User;
import com.example.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    // Rezerwacja miejsca na wydarzeniu
    @Transactional
    public Reservation reserve(User user, Event event) {
        if (reservationRepository.existsByUserAndEvent(user, event)) {
            throw new IllegalArgumentException("Użytkownik już zarezerwował miejsce na tym wydarzeniu");
        }
        if (event.getTotalSeats() <= 0) {
            throw new IllegalArgumentException("Brak wolnych miejsc na wydarzeniu");
        }
        Reservation reservation = new Reservation(user, event, LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    // Anulowanie rezerwacji
    @Transactional
    public void cancelReservation(Long reservationId) {
        reservationRepository.deleteById(reservationId);
    }

    // Lista rezerwacji użytkownika
    public List<Reservation> getReservationsByUser(User user) {
        return reservationRepository.findByUser(user);
    }

    // Lista rezerwacji dla wydarzenia
    public List<Reservation> getReservationsByEvent(Event event) {
        return reservationRepository.findByEvent(event);
    }

    // Pobieranie rezerwacji po ID
    public Optional<Reservation> getReservationById(Long reservationId) {
        return reservationRepository.findById(reservationId);
    }

    public List<Reservation> getReservationsByEventId(Long eventId) {
        return reservationRepository.findByEventId(eventId);
    }
}
