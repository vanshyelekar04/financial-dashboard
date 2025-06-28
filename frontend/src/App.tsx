import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import { useAuth } from './contexts/AuthContext';
import { useSnackbar } from './contexts/SnackbarContext';

const App: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const { showSnackbar } = useSnackbar();
  const location = useLocation();

  useEffect(() => {
    // Check authentication status on initial load
    checkAuth();
    
    // Check for errors in URL query params
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error) {
      showSnackbar(error, 'error');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route 
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;