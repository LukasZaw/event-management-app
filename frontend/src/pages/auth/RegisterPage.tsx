import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const roles = [
  { value: 'PARTICIPANT', label: 'Uczestnik' },
  { value: 'ORGANIZER', label: 'Organizator' },
];

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('PARTICIPANT');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/auth/register', { name, email, password, role });
      setSuccess('Rejestracja zakończona sukcesem! Możesz się zalogować.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data || 'Błąd rejestracji');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h5" mb={2}>Rejestracja</Typography>
      <Box component="form" onSubmit={handleSubmit} width={300}>
        <TextField
          label="Imię i nazwisko"
          fullWidth
          margin="normal"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Hasło"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <TextField
          select
          label="Rola"
          fullWidth
          margin="normal"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          {roles.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {error && (
          <Typography color="error" variant="body2" mb={1}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" variant="body2" mb={1}>
            {success}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Zarejestruj się
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterPage;