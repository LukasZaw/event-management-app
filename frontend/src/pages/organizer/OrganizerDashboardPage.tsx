import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Navbar from '../../components/Navbar';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

type Event = {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  totalSeats: number;
};

const OrganizerDashboardPage: React.FC = () => {
  const { user } = useAuth(); // Pobierz dane zalogowanego użytkownika
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    dateTime: '',
    location: '',
    totalSeats: 0,
  });

  const fetchEvents = () => {
    setLoading(true);
    setError('');
    axios
      .get('/events', { params: { organizerId: user?.email } })
      .then((res) => setEvents(res.data))
      .catch(() => setError('Nie udało się pobrać wydarzeń.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const handleAddEvent = () => {
    axios
      .post('/events', newEvent)
      .then(() => {
        setOpenDialog(false);
        fetchEvents();
      })
      .catch(() => setError('Nie udało się dodać wydarzenia. Sprawdź jeszcze raz dane i spróbuj ponowanie.'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
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

  return (
    <Box>
      <Navbar />
      <Box p={4}>
        <Typography variant="h4" mb={4} color="primary" align="center">Panel Organizatora</Typography>
        <Box mb={4} textAlign="center">
          <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
            Dodaj nowe wydarzenie
          </Button>
        </Box>
        {events.length === 0 ? (
          <Typography align="center">Nie masz jeszcze żadnych wydarzeń.</Typography>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
            {events.map((event) => (
              <Card key={event.id} sx={{ width: 340 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>{event.description}</Typography>
                  <Typography variant="body2"><b>Data:</b> {new Date(event.dateTime).toLocaleString()}</Typography>
                  <Typography variant="body2"><b>Lokalizacja:</b> {event.location}</Typography>
                  <Typography variant="body2"><b>Miejsc:</b> {event.totalSeats}</Typography>
                </CardContent>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/organizer/events/${event.id}`}
                    sx={{ m: 2 }}
                    >
                    Szczegóły
                    </Button>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Dialog do dodawania nowego wydarzenia */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Dodaj nowe wydarzenie</DialogTitle>
        <DialogContent>
          <TextField
            label="Tytuł"
            name="title"
            fullWidth
            margin="normal"
            value={newEvent.title}
            onChange={handleInputChange}
          />
          <TextField
            label="Opis"
            name="description"
            fullWidth
            margin="normal"
            value={newEvent.description}
            onChange={handleInputChange}
          />
          <TextField
            label="Data i godzina"
            name="dateTime"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newEvent.dateTime}
            onChange={handleInputChange}
          />
          <TextField
            label="Lokalizacja"
            name="location"
            fullWidth
            margin="normal"
            value={newEvent.location}
            onChange={handleInputChange}
          />
          <TextField
            label="Liczba miejsc"
            name="totalSeats"
            type="number"
            fullWidth
            margin="normal"
            value={newEvent.totalSeats}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Anuluj</Button>
          <Button onClick={handleAddEvent} color="primary">Dodaj</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizerDashboardPage;