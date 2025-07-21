import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { Box, Typography, Button, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Alert } from '@mui/material';
import Navbar from '../../components/Navbar';

type Event = {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  totalSeats: number;
  reservedSeats: number;
};

type Participant = {
  id: number;
  name: string;
  email: string;
};

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEventDetails();
    fetchParticipants();
  }, [id]);

  const fetchEventDetails = () => {
    setLoading(true);
    axios.get(`/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setError('Nie udało się pobrać szczegółów wydarzenia.'))
      .finally(() => setLoading(false));
  };

  const fetchParticipants = () => {
    axios.get(`/events/${id}/participants`)
      .then(res => setParticipants(res.data))
      .catch(() => setError('Nie udało się pobrać listy uczestników.'));
  };

  const handleEditEvent = () => {
    if (!editedEvent) return;
    axios.put(`/events/${id}`, editedEvent)
      .then(() => {
        setEditDialogOpen(false);
        fetchEventDetails();
      })
      .catch(() => setError('Nie udało się zaktualizować wydarzenia.'));
  };

  const handleDeleteEvent = () => {
    axios.delete(`/events/${id}`)
      .then(() => navigate('/organizer-dashboard'))
      .catch(() => setError('Nie udało się usunąć wydarzenia.'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEvent(prev => prev ? { ...prev, [name]: value } : null);
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

  const reservedSeats = participants.length;
  const occupancyRate = ((reservedSeats / event.totalSeats) * 100).toFixed(2);

  return (
    <Box>
      <Navbar />
      <Box p={4}>
        <Typography variant="h4" mb={4} color="primary" align="center">{event.title}</Typography>
        <Typography variant="body1" mb={2}>{event.description}</Typography>
        <Typography variant="body2"><b>Data:</b> {new Date(event.dateTime).toLocaleString()}</Typography>
        <Typography variant="body2"><b>Lokalizacja:</b> {event.location}</Typography>
        <Typography variant="body2"><b>Miejsc:</b> {event.totalSeats}</Typography>
        <Typography variant="body2"><b>Zarezerwowane miejsca:</b> {reservedSeats}</Typography>
        <Typography variant="body2"><b>Procent zajętych miejsc:</b> {occupancyRate}%</Typography>

        <Box mt={4} display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => { setEditDialogOpen(true); setEditedEvent(event); }}>
            Edytuj wydarzenie
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDeleteEvent}>
            Usuń wydarzenie
          </Button>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" mb={2}>Lista uczestników</Typography>
          {participants.length === 0 ? (
            <Typography>Brak uczestników zapisanych na to wydarzenie.</Typography>
          ) : (
            <List>
              {participants.map(participant => (
                <ListItem key={participant.id}>
                  <ListItemText primary={participant.name} secondary={participant.email} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* Dialog do edycji wydarzenia */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edytuj wydarzenie</DialogTitle>
        <DialogContent>
          <TextField
            label="Tytuł"
            name="title"
            fullWidth
            margin="normal"
            value={editedEvent?.title || ''}
            onChange={handleInputChange}
          />
          <TextField
            label="Opis"
            name="description"
            fullWidth
            margin="normal"
            value={editedEvent?.description || ''}
            onChange={handleInputChange}
          />
          <TextField
            label="Data i godzina"
            name="dateTime"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={editedEvent?.dateTime || ''}
            onChange={handleInputChange}
          />
          <TextField
            label="Lokalizacja"
            name="location"
            fullWidth
            margin="normal"
            value={editedEvent?.location || ''}
            onChange={handleInputChange}
          />
          <TextField
            label="Liczba miejsc"
            name="totalSeats"
            type="number"
            fullWidth
            margin="normal"
            value={editedEvent?.totalSeats || ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">Anuluj</Button>
          <Button onClick={handleEditEvent} color="primary">Zapisz</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetailsPage;