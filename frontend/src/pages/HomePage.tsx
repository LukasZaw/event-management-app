import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import { useAuth } from '../auth/useAuth';
import { Link} from 'react-router-dom';


const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Navbar />
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h3" mb={2} color="primary">Witaj w Event Management App!</Typography>
        {user && (
          <Box mb={3}>
            <Typography variant="h6" mb={1}>
              Zalogowany jako: <b>{user.email}</b> ({user.role})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.role === 'ORGANIZER'
                ? 'Masz dostęp do panelu organizatora, możesz dodawać i zarządzać wydarzeniami.'
                : 'Możesz rezerwować miejsca na wydarzeniach i przeglądać swoje rezerwacje.'}
            </Typography>
          </Box>
        )}
        <Box display="flex" gap={2} mb={4}>
          {user?.role === 'ORGANIZER' && (
            <>
              <Box textAlign="center">
                <Typography variant="subtitle1" mb={1}>Panel organizatora</Typography>
                <Button variant="contained" color="primary" component={Link} to="/organizer-dashboard">
                  Panel organizatora
                </Button>
              </Box>
              <Box textAlign="center">
                <Typography variant="subtitle1" mb={1}>Lista wydarzeń</Typography>
                <Button variant="outlined" color="primary" href="/events">Przeglądaj wydarzenia</Button>
              </Box>
            </>
          )}
          {user?.role === 'PARTICIPANT' && (
            <>
              <Box textAlign="center">
                <Typography variant="subtitle1" mb={1}>Panel uczestnika</Typography>
                <Button variant="contained" color="primary" component={Link} to="/events">Przeglądaj wydarzenia</Button>
              </Box>
              <Box textAlign="center">
                <Typography variant="subtitle1" mb={1}>Moje rezerwacje</Typography>
                <Button variant="outlined" color="primary" href="/my-reservations"> Moje rezerwacje</Button>
              </Box>
            </>
          )}
        </Box>
        <Box mt={2}>
          <Typography variant="body1" color="text.secondary">
            Wybierz akcję powyżej lub skorzystaj z panelu nawigacyjnego.
          </Typography>
        </Box>
        {/* Możesz dodać tu powiadomienia, panel boczny, listę wydarzeń, itp. */}
      </Box>
    </Box>
  );
};

export default HomePage;
