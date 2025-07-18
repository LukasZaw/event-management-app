import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { useAuth } from './auth/useAuth';

// Importuj swoje strony
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import EventListPage from './pages/participant/EventListPage';
// import EventDetailsPage from './pages/participant/EventDetailsPage';
// import OrganizerDashboard from './pages/organizer/OrganizerDashboard';

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
          {/* <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route
            path="/organizer"
            element={
              <PrivateRoute>
                <OrganizerDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/events" />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;