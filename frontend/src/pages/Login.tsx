import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import API from '../services/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleLogin = async () => {
    if (!email || !password) {
      showSnackbar('Please enter both email and password', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      login(res.data.token);
      showSnackbar('Login successful!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Login failed. Please try again.';
      showSnackbar(errorMessage, 'error');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box 
          component="form" 
          autoComplete="on" 
          display="flex" 
          flexDirection="column" 
          gap={2}
          onKeyPress={handleKeyPress}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            disabled={isLoading}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            disabled={isLoading}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogin}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;