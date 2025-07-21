import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { useAuth } from './auth/useAuth';

// Importuj swoje strony
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import EventListPage from './pages/participant/EventListPage';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/participant/EventDetailsPage';
import MyReservationsPage from './pages/participant/MyReservationsPage';
import OrganizerDashboardPage from './pages/organizer/OrganizerDashboardPage';
import OrganizerEvantDetailsPage from './pages/organizer/OrganizerEventDetailsPage'

function PrivateRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/my-reservations" element={<PrivateRoute><MyReservationsPage /></PrivateRoute>} />
          <Route path="/organizer-dashboard" element={<PrivateRoute><OrganizerDashboardPage /></PrivateRoute>} />
          <Route path="/organizer/events/:id" element={<PrivateRoute><OrganizerEvantDetailsPage /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;