import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import axios from '../../api/axios';

type Reservation = {
  id: number;
  event: {
    id: number;
    title: string;
    dateTime: string;
    location: string;
  };
  reservationDate: string;
};

const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/reservations/my')
      .then(res => setReservations(res.data))
      .catch(() => setError('Nie udało się pobrać rezerwacji.'))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <Box>
      <Navbar />
      <Box p={4}>
        <Typography variant="h4" mb={4} color="primary" align="center">Moje Rezerwacje</Typography>
        {reservations.length === 0 ? (
          <Typography align="center">Nie masz żadnych rezerwacji.</Typography>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
            {reservations.map(reservation => (
              <Card key={reservation.id} sx={{ width: 340 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>{reservation.event.title}</Typography>
                  <Typography variant="body2"><b>Data wydarzenia:</b> {new Date(reservation.event.dateTime).toLocaleString()}</Typography>
                  <Typography variant="body2"><b>Lokalizacja:</b> {reservation.event.location}</Typography>
                  <Typography variant="body2"><b>Data rezerwacji:</b> {new Date(reservation.reservationDate).toLocaleString()}</Typography>
                </CardContent>
                <Button size="small" variant="outlined" color="primary" href={`/events/${reservation.event.id}`} sx={{ m: 2 }}>
                  Szczegóły wydarzenia
                </Button>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyReservationsPage;