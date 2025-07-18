import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../auth/useAuth';
import { Box, Typography, Paper } from '@mui/material';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const EventListPage: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("!!!!!!Fetching user data for:", user?.email);
    // Pobierz dane użytkownika z backendu
    const fetchUser = async () => {
      try {
        console.log("Fetching user data for:", user?.email);
        const response = await axios.get(`/users/${user?.email}`);
        setUserData(response.data);
      } catch {
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchUser();
  }, [user]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h4" mb={2}>Testowa strona /events</Typography>
      {loading ? (
        <Typography>Ładowanie danych użytkownika...</Typography>
      ) : userData ? (
        <Paper elevation={3} sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6">Dane użytkownika:</Typography>
          <Typography><b>ID:</b> {userData.id}</Typography>
          <Typography><b>Imię i nazwisko:</b> {userData.name}</Typography>
          <Typography><b>Email:</b> {userData.email}</Typography>
          <Typography><b>Rola:</b> {userData.role}</Typography>
        </Paper>
      ) : (
        <Typography color="error">Nie udało się pobrać danych użytkownika.</Typography>
      )}
    </Box>
  );
};

export default EventListPage;