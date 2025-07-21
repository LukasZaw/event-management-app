import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Box, Typography, Button, Card, CardContent, CircularProgress, TextField } from '@mui/material';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

type Event = {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  totalSeats: number;
};

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');

  const fetchEvents = () => {
    setLoading(true);
    setError('');

    const params: { location?: string;} = {};
    if (location) params.location = location;

    axios
      .get('/events', { params })
      .then((res) => setEvents(res.data))
      .catch(() => setError('Nie udało się pobrać wydarzeń.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
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
        <Typography variant="h4" mb={4} color="primary" align="center">
          Dostępne wydarzenia
        </Typography>
        <Box component="form" onSubmit={handleFilter} display="flex" gap={2} mb={4} justifyContent="center">
          <TextField
            label="Lokalizacja"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Filtruj
          </Button>
        </Box>
        {events.length === 0 ? (
          <Typography align="center">Brak dostępnych wydarzeń.</Typography>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
            {events.map((event) => (
              <Card key={event.id} sx={{ width: 340 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {event.description}
                  </Typography>
                  <Typography variant="body2">
                    <b>Data:</b> {new Date(event.dateTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <b>Lokalizacja:</b> {event.location}
                  </Typography>
                  <Typography variant="body2">
                    <b>Miejsc:</b> {event.totalSeats}
                  </Typography>
                </CardContent>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/events/${event.id}`}
                  sx={{ m: 2 }}
                >
                  Szczegóły
                </Button>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EventListPage;