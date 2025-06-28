import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import API from '../services/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      login(res.data.token);
      showSnackbar('Login successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showSnackbar('Invalid credentials. Please try again.', 'error');
      console.error('Login failed:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box component="form" autoComplete="on" display="flex" flexDirection="column" gap={2}>
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            fullWidth
            required
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            fullWidth
            required
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
