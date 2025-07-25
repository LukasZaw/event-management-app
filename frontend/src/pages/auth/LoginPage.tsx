import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from '../../api/axios';
import { useAuth } from '../../auth/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/auth/login', { email, password });
      login(response.data); // response.data to JWT
      navigate('/home');
    } catch (err: any) {
      setError('Nieprawidłowy email lub hasło');
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
      <Typography variant="h5" mb={2}>Logowanie</Typography>
      <Box component="form" onSubmit={handleSubmit} width={300}>
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
        {error && (
          <Typography color="error" variant="body2" mb={1}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Zaloguj się
        </Button>
      </Box>
      <Box mt={2}>
        <Typography variant="body2">
          Nie masz konta?{' '}
          <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Zarejestruj się
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;