import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/home" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Event Management App
        </Typography>
        {user && (
          <>
            {user.role === 'ORGANIZER' && (
              <>
                <Button color="inherit" component={Link} to="/organizer-dashboard">Panel Organizatora</Button>
                <Button color="inherit" component={Link} to="/events">Lista Wydarzeń</Button>
              </>
            )}
            {user.role === 'PARTICIPANT' && (
              <>
                <Button color="inherit" component={Link} to="/my-reservations">Moje Rezerwacje</Button>
                <Button color="inherit" component={Link} to="/events">Wydarzenia</Button>
              </>
            )}
            <Button color="inherit" onClick={handleLogout}>Wyloguj</Button>
          </>
        )}
        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">Logowanie</Button>
            <Button color="inherit" component={Link} to="/register">Rejestracja</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;