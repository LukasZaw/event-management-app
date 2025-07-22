import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { Box, Typography, CircularProgress, Card, CardContent, Button, Alert } from '@mui/material';
import Navbar from '../../components/Navbar';

type Event = {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  totalSeats: number;
};

type Reservation = {
  id: number;
  event: Event;
};

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState('');
  const [isReserved, setIsReserved] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    axios.get(`/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setError('Nie udało się pobrać szczegółów wydarzenia.'))
      .finally(() => setLoading(false));

    axios.get(`/reservations/my`)
      .then(res => {
        const reservations: Reservation[] = res.data;
        const reservation = reservations.find(r => r.event.id === Number(id));
        if (reservation) {
          setIsReserved(true);
          setReservationId(reservation.id);
        }
      })
      .catch(() => setIsReserved(false));
  }, [id]);

  const handleReservation = () => {
    setReservationError('');
    setReservationSuccess(false);
    setIsProcessing(true);

    axios.post(`/reservations?eventId=${id}`)
      .then(() => {
        setReservationSuccess(true);
        setIsReserved(true);
      })
      .catch(() => setReservationError('Nie udało się zarezerwować miejsca. Spróbuj ponownie.'))
      .finally(() => setIsProcessing(false));
  };

  const handleCancelReservation = () => {
    if (!reservationId) return;

    setReservationError('');
    setReservationSuccess(false);

    axios.delete(`/reservations/${reservationId}`)
      .then(() => {
        setIsReserved(false);
        setReservationId(null);
        setReservationSuccess(true);
      })
      .catch(() => setReservationError('Nie udało się anulować rezerwacji. Spróbuj ponownie.'));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }

  if (!event) {
    return <Typography align="center">Wydarzenie nie zostało znalezione.</Typography>;
  }

  return (
    <Box>
      <Navbar />
      <Box p={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>{event.title}</Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>{event.description}</Typography>
            <Typography variant="body2"><b>Data:</b> {new Date(event.dateTime).toLocaleString()}</Typography>
            <Typography variant="body2"><b>Lokalizacja:</b> {event.location}</Typography>
            <Typography variant="body2"><b>Miejsc:</b> {event.totalSeats}</Typography>
          </CardContent>
        </Card>
        <Box mt={4} display="flex" flexDirection="column" alignItems="center" gap={2}>
          {reservationSuccess && <Alert severity="success">Operacja zakończona sukcesem!</Alert>}
          {reservationError && <Alert severity="error">{reservationError}</Alert>}
          {isReserved ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancelReservation}
              sx={{ backgroundColor: 'gray' }}
            >
              Wypisz się z wydarzenia
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleReservation}
              disabled={isProcessing}
            >
              {isProcessing ? 'Przetwarzanie...' : 'Zarezerwuj miejsce'}
            </Button>
          )}
          <Button variant="outlined" color="primary" href="/events">
            Powrót do listy wydarzeń
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EventDetailsPage;